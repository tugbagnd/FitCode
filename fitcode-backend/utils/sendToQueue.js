// utils/sendToQueue.js
const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "fitcode_queue";

async function sendToQueue(data) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });

    console.log("📤 Mesaj kuyruğa gönderildi:", data);

    setTimeout(() => {
      connection.close();
    }, 500); // Bağlantıyı kapat
  } catch (error) {
    console.error("❌ Mesaj gönderme hatası:", error);
  }
}

module.exports = sendToQueue;
