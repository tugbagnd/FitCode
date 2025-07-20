const amqp = require("amqplib");

let channel;
let connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ bağlantısı kuruldu.");

    await channel.assertQueue("fitcode_queue"); // Kuyruk oluştur
  } catch (error) {
    console.error("❌ RabbitMQ bağlantı hatası:", error);
  }
}

function sendToQueue(data) {
  if (channel) {
    channel.sendToQueue("fitcode_queue", Buffer.from(JSON.stringify(data)));
    console.log("📤 Kuyruğa mesaj gönderildi:", data);
  } else {
    console.error("❌ Kanal yok, önce connectRabbitMQ çağrılmalı.");
  }
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
};
