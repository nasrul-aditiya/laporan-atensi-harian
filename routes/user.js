const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");

// middleware khusus admin
function onlyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
}

// ================= CREATE =================
router.post("/user", verifyToken, (req, res) => {
  const { nama, jabatan, username, password, role } = req.body;

  db.query(
    "INSERT INTO users (nama, jabatan, username, password, role) VALUES (?, ?, ?, ?, ?)",
    [nama, jabatan, username, password, role],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal tambah user" });
      res.json({ message: "User berhasil ditambahkan" });
    },
  );
});

// ================= READ =================
router.get("/user", verifyToken, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= UPDATE =================
router.put("/user/:id", verifyToken, (req, res) => {
  const { nama, jabatan, username, password, role } = req.body;

  // jika password diisi
  if (password && password.trim() !== "") {
    db.query(
      `UPDATE users
       SET nama=?, jabatan=?, username=?, password=?, role=?
       WHERE id=?`,
      [nama, jabatan, username, password, role, req.params.id],
      (err) => {
        if (err)
          return res.status(500).json({
            message: "Gagal update",
          });

        res.json({
          message: "User berhasil diupdate",
        });
      },
    );
  } else {
    // jika password kosong
    db.query(
      `UPDATE users
       SET nama=?, jabatan=?, username=?, role=?
       WHERE id=?`,
      [nama, jabatan, username, role, req.params.id],
      (err) => {
        if (err)
          return res.status(500).json({
            message: "Gagal update",
          });

        res.json({
          message: "User berhasil diupdate",
        });
      },
    );
  }
});

// ================= DELETE =================
router.delete("/user/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus" });
    res.json({ message: "User berhasil dihapus" });
  });
});

module.exports = router;
