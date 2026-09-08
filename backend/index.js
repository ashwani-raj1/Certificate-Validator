require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const verifyToken = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  "https://www.certificatevalidator.online",
  "https://certificatevalidator.online",
  "https://certificate-validator-using-blockch.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Connection established"));
app.get("/about", (req, res) => res.json({ message: "This is about page" }));
app.get("/api/health", (req, res) =>
  res.json({
    status: "online",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);
app.get("/adminData", verifyToken, (req, res) =>
  res.json({ message: "Protected Admin Data", admin: req.user }),
);

app.use(authRoutes);
app.use(certificateRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`)),
  )
  .catch((error) => {
    console.error("DB Error:", error.message);
    process.exit(1);
  });
