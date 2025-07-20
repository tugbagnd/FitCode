const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost"; // .env'den alabilirsin istersen
const QUEUE_NAME = "fitcode_queue";

async function startWorker() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`📥 Worker başlatıldı. Kuyruk dinleniyor: "${QUEUE_NAME}"`);

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("📩 Yeni Mesaj Alındı:", content);

        switch (content.action) {
          case "article_created":
            console.log(`📢 Yeni makale bildirimi: Başlık: ${content.article.title}`);
            // Burada ek işlem yapabilirsin (e-posta, loglama vb.)
            break;

          case "sunucu_başlatıldı":
            console.log("⚙️ Sunucu başlatıldı bildirimi alındı.");
            break;

          default:
            console.log("⚠️ Bilinmeyen action tipi:", content.action);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ Worker başlatılırken hata oluştu:", err);
  }
}

startWorker();
