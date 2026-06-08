const jwt = require("jsonwebtoken");
const SECRET = "rahasia";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token kadaluarsa",
          expired: true,
        });
      }

      return res.status(401).json({
        message: "Token tidak valid",
      });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
