const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// .env dosyasını yükle
dotenv.config();

const app = express();

// .env'deki MONGO_URI değerini kontrol et
console.log("MONGO_URI:", process.env.MONGO_URI);  // Bunu ekledim

// Middleware: JSON verileri işle
app.use(express.json());

// CORS ayarları: Sadece bu adreslerden istek kabul et
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}));

// Türkçe karakter desteği için Content-Type header ayarla
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

// Rotaları dahil et
const authRoutes = require("./routes1/auth1");
const profileRoutes = require("./routes1/profile1");
const articleRoutes = require("./routes1/article1");
const waterRoutes = require("./routes1/waterRoutes");
const foodRoutes = require("./routes1/foodRoutes");
const mealRoutes = require("./routes1/mealRoutes");
const foodLogRoutes = require("./routes1/foodLogRoutes");

// Rota kullanımları
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/foodlog", foodLogRoutes);

// Test endpoint
app.get("/", (req, res) => {
    res.json({
        message: "✅ FitCode Backend çalışıyor.",
        port: process.env.PORT || 5000
    });
});

// MongoDB bağlantısı (burada .env içindeki MONGO_URI kullanılıyor)
mongoose.connect(process.env.MONGO_URI, {
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

// Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
