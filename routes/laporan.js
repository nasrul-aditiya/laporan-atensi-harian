const express = require("express");
const router = express.Router();
const db = require("../db");

const verifyToken = require("../middleware/auth");

router.post("/laporan", verifyToken, (req, res) => {
  const { tanggal, postingan } = req.body;
  const user_id = req.user.id; // ⬅️ ambil dari token

  db.query(
    "INSERT INTO laporan (tanggal, user_id, jumlah_postingan) VALUES (?, ?, ?)",
    [tanggal, user_id, postingan.length],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const laporanId = result.insertId;

      postingan.forEach((p) => {
        db.query(
          "INSERT INTO postingan (laporan_id, judul) VALUES (?, ?)",
          [laporanId, p.judul],
          (err, resultPostingan) => {
            if (err) return;

            const postinganId = resultPostingan.insertId;

            p.platform.forEach((plat) => {
              db.query(
                "INSERT INTO platform (postingan_id, jenis, link) VALUES (?, ?, ?)",
                [postinganId, plat.jenis, plat.link]
              );
            });
          }
        );
      });

      res.json({ message: "Laporan berhasil disimpan" });
    }
  );
});

router.get("/grafik", (req, res) => {
  db.query(
    `SELECT MONTH(tanggal) as bulan, COUNT(*) as total
     FROM laporan
     GROUP BY MONTH(tanggal)`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

router.get("/statistik", (req, res) => {
  const data = {};

  // 1. jumlah postingan minggu ini
  db.query(
    `SELECT COUNT(*) as total 
     FROM laporan 
     WHERE YEARWEEK(tanggal, 1) = YEARWEEK(CURDATE(), 1)`,
    (err, result1) => {
      data.mingguan = result1[0].total;

      // 2. user paling aktif
      db.query(
        `SELECT users.nama, COUNT(laporan.id) as total
         FROM laporan
         JOIN users ON users.id = laporan.user_id
         GROUP BY user_id
         ORDER BY total DESC
         LIMIT 1`,
        (err, result2) => {
          data.topUser = result2[0] || { nama: "-", total: 0 };

          // 3. grafik bulanan
          db.query(
            `SELECT MONTH(tanggal) as bulan, COUNT(*) as total
             FROM laporan
             GROUP BY MONTH(tanggal)`,
            (err, result3) => {
              data.grafik = result3;
              res.json(data);
            }
          );
        }
      );
    }
  );
});

// jumlah laporan minggu ini
router.get("/mingguan", (req, res) => {
  db.query(
    `SELECT COUNT(*) as total 
     FROM laporan 
     WHERE YEARWEEK(tanggal, 1) = YEARWEEK(CURDATE(), 1)`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// user paling aktif
router.get("/top-user", (req, res) => {
  db.query(
    `SELECT users.nama, COUNT(laporan.id) as total
     FROM laporan
     JOIN users ON users.id = laporan.user_id
     GROUP BY user_id
     ORDER BY total DESC
     LIMIT 1`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || { nama: "-", total: 0 });
    }
  );
});

// ================= READ =================
router.get("/laporan", verifyToken, (req, res) => {
  const { dari, sampai, user } = req.query;

  let sql = `
    SELECT laporan.*, users.nama 
    FROM laporan 
    JOIN users ON laporan.user_id = users.id
    WHERE 1=1
  `;

  const params = [];

  if (dari && sampai) {
    sql += " AND tanggal BETWEEN ? AND ?";
    params.push(dari, sampai);
  }

  if (user) {
    sql += " AND user_id = ?";
    params.push(user);
  }

  sql += " ORDER BY tanggal DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= DELETE =================
router.delete("/laporan/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM laporan WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus" });
    res.json({ message: "Laporan berhasil dihapus" });
  });
});

// ================= DETAIL =================
router.get("/laporan/:id", verifyToken, (req, res) => {

  const laporanId = req.params.id;

  const sql = `
    SELECT 
      l.id AS laporan_id,
      l.tanggal,
      u.nama,
      p.id AS postingan_id,
      p.judul,
      pl.jenis,
      pl.link
    FROM laporan l
    JOIN users u ON l.user_id = u.id
    JOIN postingan p ON p.laporan_id = l.id
    LEFT JOIN platform pl ON pl.postingan_id = p.id
    WHERE l.id = ?
  `;

  db.query(sql, [laporanId], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.json({ data: null });
    }

    const result = {
      laporan_id: rows[0].laporan_id,
      tanggal: rows[0].tanggal,
      nama: rows[0].nama,
      postingan: {}
    };

    rows.forEach(row => {
      if (!result.postingan[row.postingan_id]) {
        result.postingan[row.postingan_id] = {
          judul: row.judul,
          platform: []
        };
      }

      if (row.jenis && row.link) {
        result.postingan[row.postingan_id].platform.push({
          jenis: row.jenis,
          link: row.link
        });
      }
    });

    res.json(result);
  });
});

module.exports = router;