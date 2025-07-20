// utils/redisClient.js
const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const client = redis.createClient({
  url: REDIS_URL
});

client.on("error", (err) => {
  console.error("Redis bağlantı hatası:", err);
});

client.connect()
  .then(() => console.log("✅ Redis'e bağlantı başarılı!"))
  .catch((err) => console.error("❌ Redis bağlantı hatası:", err));

module.exports = client;
