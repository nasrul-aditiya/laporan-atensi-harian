const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "rahasia";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (results.length === 0) {
        return res.status(401).json({ message: "Login gagal" });
      }

      const user = results[0];

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login berhasil",
        token,
        user
      });
    }
  );
});

module.exports = router;