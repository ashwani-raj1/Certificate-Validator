const crypto = require("crypto");
const fs = require("fs");
const xlsx = require("xlsx");
const Tesseract = require("tesseract.js");
const User = require("../models/User");
const contract = require("../blockchain/blockChain");
const generateHash = (event, name, roll, certificateid, date) =>
  crypto
    .createHash("sha256")
    .update(`${event}${name}${roll}${certificateid}${date}`)
    .digest("hex");
const checkCertificate = async (certificateid) => {
  const user = await User.findOne({ certificateid });
  if (!user)
    return { valid: false, status: 404, message: "Certificate Not Found" };
  const mongoHash = generateHash(
    user.event,
    user.name,
    user.roll,
    user.certificateid,
    user.date,
  );
  const blockchainHash = await contract.getCertificateHash(certificateid);
  if (mongoHash.toLowerCase() !== String(blockchainHash).toLowerCase())
    return {
      valid: false,
      status: 200,
      message: "Certificate Tampered",
      mongoHash,
      blockchainHash,
    };
  return {
    valid: true,
    status: 200,
    message: "Certificate Verified",
    transactionHash: user.transactionHash,
    blockchainHash,
    data: user,
  };
};
async function createCertificate({
  eventName,
  studentName,
  studentRoll,
  credential,
  date,
}) {
  if (!eventName || !studentName || !studentRoll || !credential || !date)
    throw new Error("All fields are required");
  const certificateid = String(credential).trim().toUpperCase();
  if (await User.exists({ certificateid })) {
    const error = new Error("Certificate already exists");
    error.status = 409;
    throw error;
  }
  const blockchainHash = generateHash(
    eventName,
    studentName,
    studentRoll,
    certificateid,
    date,
  );
  const tx = await contract.addCertificate(certificateid, blockchainHash);
  await tx.wait();
  const user = await User.create({
    event: eventName,
    name: studentName,
    roll: studentRoll,
    certificateid,
    date,
    blockchainHash,
    transactionHash: tx.hash,
  });
  return { user, transactionHash: tx.hash, blockchainHash };
}
exports.verifyById = async (req, res) => {
  try {
    const result = await checkCertificate(
      req.params.certificateid.trim().toUpperCase(),
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        valid: false,
        message: "Certificate verification failed",
        error: error.reason || error.message,
      });
  }
};
exports.addCertificate = async (req, res) => {
  try {
    const result = await createCertificate(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Certificate Added Successfully",
        data: result.user,
        transactionHash: result.transactionHash,
        blockchainHash: result.blockchainHash,
      });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ success: false, message: error.message, error: error.reason });
  }
};
exports.verifyImage = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ valid: false, message: "No certificate image uploaded" });
    const ocr = await Tesseract.recognize(req.file.buffer, "eng");
    const match = (ocr.data.text || "").match(
      /\bCERT(?:[_-]+[A-Z0-9]+)+\b|\bCERT\d+\b/i,
    );
    if (!match)
      return res
        .status(200)
        .json({ valid: false, message: "Certificate ID not detected" });
    const result = await checkCertificate(match[0].toUpperCase());
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        valid: false,
        message: "Image verification failed",
        error: error.reason || error.message,
      });
  }
};
exports.uploadExcel = async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No Excel file uploaded" });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const rows = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      { raw: false },
    );
    if (!rows.length)
      return res
        .status(400)
        .json({ success: false, message: "Excel file is empty" });
    const failed = [];
    let added = 0;
    let skipped = 0;
    for (const row of rows) {
      try {
        await createCertificate(row);
        added++;
      } catch (error) {
        if (error.message === "Certificate already exists") skipped++;
        else
          failed.push({
            credential: row.credential || "Unknown",
            reason: error.message,
          });
      }
    }
    return res.json({
      success: true,
      message: "Excel processing completed",
      total: rows.length,
      added,
      skipped,
      failed: failed.length,
      failedCertificates: failed,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Excel upload failed",
        error: error.message,
      });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
};
