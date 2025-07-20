const Water = require("../models1/Water");
const redisClient = require("../utils/redisClient");

// ✅ Su tüketimini kaydet ve toplamı döndür + Redis güncelle
exports.addWater = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const key = `water:${userId}`;

        const newEntry = new Water({
            userId,
            amount,
        });

        await newEntry.save();

        // Türkiye saatine göre bugünün başlangıcı ve sonu
        const now = new Date();
        const trOffset = 3 * 60 * 60 * 1000;
        const localNow = new Date(now.getTime() + trOffset);

        const startOfDay = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()));
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        // Bugünkü tüm kayıtları getir
        const records = await Water.find({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        const total = records.reduce((sum, item) => sum + item.amount, 0);

        // 🔄 Redis'e güncel toplamı yaz
        await redisClient.set(key, total);

        res.status(201).json({
            message: "Su tüketimi kaydedildi.",
            amount,
            total,
        });
    } catch (err) {
        res.status(500).json({
            message: "Su kaydedilirken hata oluştu",
            error: err.message,
        });
    }
};

// ✅ Bugünkü toplam su tüketimini getir (önce Redis, yoksa MongoDB)
exports.getTodayWater = async (req, res) => {
    try {
        const userId = req.user.id;
        const key = `water:${userId}`;

        // 🔍 Önce Redis'e bak
        let total = await redisClient.get(key);

        if (total !== null) {
            return res.json({ total: parseInt(total), source: "redis" });
        }

        // Eğer Redis'te yoksa veritabanından çek
        const now = new Date();
        const trOffset = 3 * 60 * 60 * 1000;
        const localNow = new Date(now.getTime() + trOffset);

        const startOfDay = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()));
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        const records = await Water.find({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        total = records.reduce((sum, item) => sum + item.amount, 0);

        // 📥 Redis'e kaydet (sonraki isteklerde kullanmak için)
        await redisClient.set(key, total);

        res.json({ total, source: "mongodb" });
    } catch (err) {
        res.status(500).json({
            message: "Su verisi alınamadı",
            error: err.message
        });
    }
};
