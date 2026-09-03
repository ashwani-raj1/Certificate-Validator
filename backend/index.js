require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tesseract = require("tesseract.js");
const crypto = require("crypto");

const User = require("./models/User");
const Admin = require("./models/admin");
const verifyToken = require("./middleware/auth");
const contract = require("./blockchain/blockChain");

const app = express();

const port = process.env.PORT || 5000;
const dataBaseUrl = process.env.MONGO_URL;

const allowedOrigins = [
    "https://www.certificatevalidator.online",
    "https://certificatevalidator.online",
    "https://certificate-validator-using-blockch.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname +
                "-" +
                Date.now() +
                path.extname(file.originalname),
        );
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

// Certificate images are kept in Cloudinary so OCR works on hosted instances
// where the server filesystem is temporary or unavailable.
const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype.startsWith("image/"));
    },
});

async function uploadCertificateImage(buffer, mimetype) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "certificate-verification";
    const signature = crypto
        .createHash("sha1")
        .update(
            `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`,
        )
        .digest("hex");

    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: mimetype }), "certificate-image");
    formData.append("api_key", process.env.CLOUDINARY_API_KEY);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || "Cloudinary upload failed");
    }

    return result;
}

function deleteFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("File deletion error:", err.message);
            }
        });
    }
}

function generateCertificateHash(event, name, roll, certificateid, date) {
    const dataToHash =
        String(event) +
        String(name) +
        String(roll) +
        String(certificateid) +
        String(date);

    return crypto
        .createHash("sha256")
        .update(dataToHash)
        .digest("hex");
}

mongoose
    .connect(dataBaseUrl)
    .then(() => {
        console.log("DB Connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("DB Error:", err);
        process.exit(1);
    });

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected",
    });
});

app.get("/", (req, res) => {
    res.send("Connection established");
});

app.get("/about", (req, res) => {
    res.json({
        message: "This is about page",
    });
});

app.get("/verify/:certificateid", async (req, res) => {
    try {
        const certificateid = req.params.certificateid
            .trim()
            .toUpperCase();

        const user = await User.findOne({
            certificateid,
        });

        if (!user) {
            return res.status(404).json({
                valid: false,
                message: "Certificate Not Found",
            });
        }

        const generatedHash = generateCertificateHash(
            user.event,
            user.name,
            user.roll,
            user.certificateid,
            user.date,
        );

        const blockchainHash =
            await contract.getCertificateHash(certificateid);

        if (
            generatedHash.toLowerCase() !==
            String(blockchainHash).toLowerCase()
        ) {
            return res.status(200).json({
                valid: false,
                message: "Certificate Tampered",
                mongoHash: generatedHash,
                blockchainHash,
            });
        }

        return res.status(200).json({
            valid: true,
            message: "Certificate Verified",
            transactionHash: user.transactionHash,
            blockchainHash,
            data: user,
        });
    } catch (err) {
        console.log("Verification error:", err);

        return res.status(500).json({
            valid: false,
            message: "Certificate verification failed",
            error: err.reason || err.message,
        });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                valid: false,
                message: "Email and password are required",
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!admin) {
            return res.status(404).json({
                valid: false,
                message: "Admin not found",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password,
        );

        if (!passwordMatch) {
            return res.status(401).json({
                valid: false,
                message: "Wrong Password",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            },
        );

        return res.status(200).json({
            valid: true,
            message: "Login successful",
            token,
        });
    } catch (err) {
        console.log("Signin error:", err);

        return res.status(500).json({
            valid: false,
            message: "Server error",
            error: err.message,
        });
    }
});

app.post("/add", verifyToken, async (req, res) => {
    try {
        const {
            eventName,
            studentName,
            studentRoll,
            credential,
            date,
        } = req.body;

        if (
            !eventName ||
            !studentName ||
            !studentRoll ||
            !credential ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const certificateid = credential.trim().toUpperCase();

        const existing = await User.findOne({
            certificateid,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Certificate already exists",
            });
        }

        const hash = generateCertificateHash(
            eventName,
            studentName,
            studentRoll,
            certificateid,
            date,
        );

        const tx = await contract.addCertificate(
            certificateid,
            hash,
        );

        await tx.wait();

        const user = new User({
            event: eventName,
            name: studentName,
            roll: studentRoll,
            certificateid,
            date,
            blockchainHash: hash,
            transactionHash: tx.hash,
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Certificate Added Successfully",
            transactionHash: tx.hash,
            blockchainHash: hash,
            data: user,
        });
    } catch (err) {
        console.log("Add certificate error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to add certificate",
            error: err.reason || err.message,
        });
    }
});

app.get("/adminData", verifyToken, (req, res) => {
    res.json({
        message: "Protected Admin Data",
    });
});

app.post(
    "/verify/verify-image",
    imageUpload.single("certificate"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    valid: false,
                    message: "No certificate image uploaded",
                });
            }

            if (
                !process.env.CLOUDINARY_CLOUD_NAME ||
                !process.env.CLOUDINARY_API_KEY ||
                !process.env.CLOUDINARY_API_SECRET
            ) {
                return res.status(500).json({
                    valid: false,
                    message: "Cloudinary is not configured",
                });
            }

            const uploadedImage = await uploadCertificateImage(
                req.file.buffer,
                req.file.mimetype,
            );

            const result = await Tesseract.recognize(
                uploadedImage.secure_url,
                "eng",
            );

            let text = result.data.text || "";

            text = text.replace(/\s/g, "");
            text = text.replace(/O/g, "0");

            const regex = /CERT\d+/i;
            const match = text.match(regex);

            if (!match) {
                return res.status(200).json({
                    valid: false,
                    message: "Certificate ID not detected",
                });
            }

            const certificateID = match[0].toUpperCase();

            const certificate = await User.findOne({
                certificateid: certificateID,
            });

            if (!certificate) {
                return res.status(404).json({
                    valid: false,
                    message: "Invalid Certificate",
                });
            }

            const generatedHash = generateCertificateHash(
                certificate.event,
                certificate.name,
                certificate.roll,
                certificate.certificateid,
                certificate.date,
            );

            const blockchainHash =
                await contract.getCertificateHash(
                    certificateID,
                );

            if (
                generatedHash.toLowerCase() !==
                String(blockchainHash).toLowerCase()
            ) {
                return res.status(200).json({
                    valid: false,
                    message: "Certificate Tampered",
                });
            }

            return res.status(200).json({
                valid: true,
                message: "Certificate Verified",
                transactionHash:
                    certificate.transactionHash,
                blockchainHash,
                data: certificate,
            });
        } catch (err) {
            console.log("Image verification error:", err);

            return res.status(500).json({
                valid: false,
                message: "Server Error",
                error: err.reason || err.message,
            });
        }
    },
);

app.post(
    "/upload",
    verifyToken,
    upload.single("excelFile"),
    async (req, res) => {
        let filePath;

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            filePath = req.file.path;

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const data = xlsx.utils.sheet_to_json(
                worksheet,
                {
                    raw: false,
                },
            );

            if (!data.length) {
                return res.status(400).json({
                    success: false,
                    message: "Excel file is empty",
                });
            }

            let added = 0;
            let skipped = 0;
            const failed = [];

            for (const row of data) {
                try {
                    if (
                        !row.eventName ||
                        !row.studentName ||
                        !row.studentRoll ||
                        !row.credential ||
                        !row.date
                    ) {
                        failed.push({
                            credential:
                                row.credential || "Unknown",
                            reason: "Missing required fields",
                        });

                        continue;
                    }

                    const certificateid = String(
                        row.credential,
                    )
                        .trim()
                        .toUpperCase();

                    const existing = await User.findOne({
                        certificateid,
                    });

                    if (existing) {
                        skipped++;
                        continue;
                    }

                    const hash = generateCertificateHash(
                        row.eventName,
                        row.studentName,
                        row.studentRoll,
                        certificateid,
                        row.date,
                    );

                    const tx =
                        await contract.addCertificate(
                            certificateid,
                            hash,
                        );

                    await tx.wait();

                    const user = new User({
                        event: row.eventName,
                        name: row.studentName,
                        roll: row.studentRoll,
                        certificateid,
                        date: row.date,
                        blockchainHash: hash,
                        transactionHash: tx.hash,
                    });

                    await user.save();

                    added++;
                } catch (err) {
                    console.log(
                        `Failed certificate ${row.credential}:`,
                        err,
                    );

                    failed.push({
                        credential:
                            row.credential || "Unknown",
                        reason:
                            err.reason ||
                            err.message ||
                            "Unknown error",
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Excel processing completed",
                total: data.length,
                added,
                skipped,
                failed: failed.length,
                failedCertificates: failed,
            });
        } catch (err) {
            console.log("Excel upload error:", err);

            return res.status(500).json({
                success: false,
                message: "Excel upload failed",
                error: err.reason || err.message,
            });
        } finally {
            deleteFile(filePath);
        }
    },
);

app.use((err, req, res, next) => {
    console.log("Server error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
