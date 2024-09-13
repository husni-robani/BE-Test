const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    jwt.verify(token, "your-secret-key");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;
