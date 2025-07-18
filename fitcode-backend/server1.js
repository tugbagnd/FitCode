const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// 🌐 Middleware'ler
app.use(express.json());

// ✅ CORS (Güncel ayar)
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}));

// 🔄 Türkçe karakter desteği
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

// 👉 Rota dosyaları
const authRoutes = require("./routes1/auth1");
const profileRoutes = require("./routes1/profile1");
const articleRoutes = require("./routes1/article1");
const waterRoutes = require("./routes1/waterRoutes");
const foodRoutes = require("./routes1/foodRoutes");
const mealRoutes = require("./routes1/mealRoutes"); // 🍽️ Eğer varsa bırak
const foodLogRoutes = require("./routes1/foodLogRoutes"); // ✅ Günlük besin takibi

// 📍 Rota kullanımları
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/meals", mealRoutes); // varsa
app.use("/api/foodlog", foodLogRoutes); // 🔥 Kalori takibi

// 🧪 Test endpoint
app.get("/", (req, res) => {
    res.json({
        message: "✅ FitCode Backend çalışıyor.",
        port: process.env.PORT || 5000
    });
});

// 🌐 MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("✅ MongoDB bağlantısı başarılı");
    })
    .catch((err) => {
        console.error("❌ MongoDB bağlantı hatası:", err.message);
        process.exit(1);
    });

// 🚀 Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});