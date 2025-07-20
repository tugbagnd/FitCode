const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// RabbitMQ bağlantısını ekle
const { connectRabbitMQ, sendToQueue } = require("./rabbitmq");

// Redis bağlantısını ekle
const redisClient = require("./utils/redisClient");

dotenv.config();

const articleRoutes = require("./routes1/article1");
const authRoutes = require("./routes1/auth1");
const waterRoutes = require("./routes1/waterRoutes");  // Düzeltildi

const app = express();

app.use(cors());
app.use(express.json());

// Makale rotaları
app.use("/api/articles", articleRoutes);

// Auth rotaları
app.use("/api/auth", authRoutes);

// Su takibi rotaları
app.use("/api/water", waterRoutes);

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB bağlantısı başarılı!");

    // Redis bağlantısı redisClient.js içinde zaten yapılıyor

    // RabbitMQ bağlantısı başlasın
    await connectRabbitMQ();

    // Test amaçlı mesaj gönder
    sendToQueue({ action: "sunucu_başlatıldı", zaman: new Date().toISOString() });

    // Sunucu başlatılsın
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Sunucu çalışıyor: http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err);
  });
