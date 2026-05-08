require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 5000;
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const mongoose = require("mongoose");
const dataBaseUrl = process.env.MONGO_URL
const User = require("./models/User");
const Admin = require("./models/admin")
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");
app.use(express.json());
const Tesseract = require("tesseract.js");

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

mongoose.connect(dataBaseUrl)
.then(() => {
    console.log("✅ DB Connected");

    app.listen(port, () => {
        console.log(` Server running on port ${port}`);
    });

})
.catch(err => {
    console.log("❌ DB Error:", err);
});

app.get("/",(req,res)=>{
    res.send("Connection established");
})

app.get("/about",(req,res)=>{
    res.json({
        message: "This is about page"
    });
});

app.get("/verify/:certificateid", async (req, res) => {
    try {
        const certificateid = String(req.params.certificateid);

        const user = await User.findOne({ certificateid });

        if (user) {
            return res.status(200).json({
                valid: true,
                data: user
            });
        } else {
            return res.status(404).json({
                valid: false,
                message: "Certificate not found"
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/signin",async(req,res)=>{
    try{
    const {email,password} = req.body;
    const admin = await Admin.findOne({email});
    if (!admin){
        return res.status(404).json({
            valid: false,
            message: "Admin not found"
        });
    }
    if(admin.password !== password){
        return res.status(401).json({
            valid: false,
            message: "Wrong Password"
        })
    }
    const token  = jwt.sign({
        id: admin._id,
        email: admin.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);res.status(200).json({
            valid: true,
            token
        });
    }catch(err){
        res.status(500).json({error : err.message});
    }
})

app.post("/add", async (req, res) => {
    try{
    const {eventName,studentName,studentRoll,credential,date} = req.body;
    const user = new User({
        event: eventName,
        name: studentName,
        roll: studentRoll,
        certificateid : credential,
        date: date
    });
    await user.save();
    res.json({message: "Data saved successfully"});
    }catch(err){
        res.status(500).json({error: err.message})
    }

});

app.get("/adminData", verifyToken, (req, res) => {

    res.json({
        message: "Protected Admin Data"
    });

});

app.post("/verify/verify-image",upload.single("certificate"),async(req,res)=>{
    try{
        const result = await Tesseract.recognize(req.file.path,"eng");
        let text = result.data.text;

        /* REMOVE SPACES */

        text = text.replace(/\s/g, "");

        /* CONVERT O → 0 */

        text = text.replace(/O/g, "0");

        console.log(text);
        const regex = /CERT\d+/i;
        const match = text.match(regex);
        if(!match){
            return res.json({
                valid: false,
                message: "Invalid Certificate"
            })
        }
        const certificateID = match[0];
        const certificate = await User.findOne({
            certificateid: certificateID
        })
        if(certificate){
            return res.json({
                valid: true,
                data: certificate
            })
        }else{
            return res.json({
                valid: false,
                message: "Invalid Certificate"
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        })
    }
})

app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);

    // Convert Excel rows → DB format
    const users = data.map(row => ({
      event: row.eventName,
      name: row.studentName,
      roll: row.studentRoll,
      certificateid: row.credential,
      date: row.date
    }));

    // Insert all at once
    await User.insertMany(users);

    res.json({ message: "Excel data uploaded & saved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
