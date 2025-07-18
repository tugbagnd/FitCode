const express = require("express");
const router = express.Router();

// Controller fonksiyonlar�
const {
    addWater,
    getTodayWater
} = require("../controllers1/waterController");

// JWT do�rulama middleware'i
const { authenticateToken } = require("../middleware/authMiddleware");

// Su ekleme (g�nl�k)
router.post("/", authenticateToken, addWater);

// Bug�nk� toplam su t�ketimini alma
router.get("/today", authenticateToken, getTodayWater);

module.exports = router;