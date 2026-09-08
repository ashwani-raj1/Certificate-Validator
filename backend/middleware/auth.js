const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorization = req.get("Authorization") || "";
  // Supports both Bearer tokens and this project's original raw-token header.
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : authorization.trim();

  if (!token)
    return res.status(401).json({ message: "Authorization token is required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
