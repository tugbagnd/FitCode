const Water = require("../models1/Water");
const sendToQueue = require("../utils/sendToQueue");

console.log("Water modeli yüklendi:", Water);

exports.addWaterEntry = async (req, res) => {
  try {
    console.log("addWaterEntry fonksiyonu çağrıldı");
    const { userId, amount } = req.body;

    console.log("Gelen veriler:", { userId, amount });

    const newEntry = new Water({ userId, amount });
    console.log("Yeni Water nesnesi oluşturuldu:", newEntry);

    await newEntry.save();

    console.log("Water kaydı kaydedildi");

    // RabbitMQ kuyruğuna mesaj gönder
    await sendToQueue({
      action: "water_entry_created",
      waterEntry: newEntry,
    });

    res.status(201).json({ message: "Su takibi kaydı eklendi", waterEntry: newEntry });
  } catch (err) {
    console.error("Hata yakalandı:", err);
    res.status(400).json({ message: "Su takibi kaydı eklenemedi", error: err.message });
  }
};
