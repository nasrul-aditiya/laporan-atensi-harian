const jwt = require("jsonwebtoken");
const SECRET = "rahasia";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token tidak ada" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token tidak valid" });

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;