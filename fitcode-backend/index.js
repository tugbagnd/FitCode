const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const articleRoutes = require("./routes1/article1"); // routes1 klasöründe olmalı

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes); // http://localhost:5000/api/articles

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB bağlantısı başarılı!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Sunucu çalışıyor: http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err);
  });
