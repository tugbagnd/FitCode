const Food = require("../models1/Food");

// 🟢 YENİ BESİN EKLEME
const addFood = async (req, res) => {
    try {
        const { name, calories } = req.body;

        if (!name || !calories) {
            return res.status(400).json({ message: "İsim ve kalori zorunludur." });
        }

        const existingFood = await Food.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingFood) {
            return res.status(400).json({ message: "Bu besin zaten mevcut." });
        }

        const newFood = new Food({ name, calories });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// 🔍 BESİN ARAMA
const searchFood = async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            return res.status(400).json({ message: "Besin adı gereklidir." });
        }

        const foods = await Food.find({
            name: { $regex: new RegExp(name, 'i') } // benzer isimleri getir
        });

        if (!foods.length) {
            return res.status(404).json({ message: "Besin bulunamadı." });
        }

        res.json(foods); // ✅ array olarak dön
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// ✏️ BESİN GÜNCELLEME
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, calories } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { name, calories },
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ message: "Besin bulunamadı." });
        }

        res.json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// ❌ BESİN SİLME
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return res.status(404).json({ message: "Besin bulunamadı." });
        }

        res.json({ message: "Besin silindi." });
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

module.exports = {
    addFood,
    searchFood,
    updateFood,
    deleteFood
};