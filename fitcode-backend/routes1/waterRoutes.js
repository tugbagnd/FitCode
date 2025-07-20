const express = require("express");
const router = express.Router();

// Controller fonksiyonları
const {
    addWater,
    getTodayWater
} = require("../controllers1/waterController");

// JWT doğrulama middleware'i
const { authenticateToken } = require("../middleware/authMiddleware");

// Su ekleme (günlük)
router.post("/", authenticateToken, addWater);

// Bugünkü toplam su tüketimini alma
router.get("/today", authenticateToken, getTodayWater);

module.exports = router;
