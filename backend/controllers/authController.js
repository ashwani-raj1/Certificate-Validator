const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ valid: false, message: "Email and password are required" });
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res
        .status(401)
        .json({ valid: false, message: "Invalid email or password" });
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.json({ valid: true, message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ valid: false, message: "Server error", error: error.message });
  }
};
