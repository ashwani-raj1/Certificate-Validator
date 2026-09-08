const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const excelUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) =>
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
      ),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(
      null,
      [".xlsx", ".xls"].includes(path.extname(file.originalname).toLowerCase()),
    ),
});
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});
module.exports = { excelUpload, imageUpload };
