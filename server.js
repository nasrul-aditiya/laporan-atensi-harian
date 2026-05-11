const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const laporanRoutes = require("./routes/laporan");
app.use("/api", laporanRoutes);

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const userRoutes = require("./routes/user");
app.use("/api", userRoutes);

const laporanRoute = require("./routes/laporan");
app.use("/api", laporanRoute);

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});