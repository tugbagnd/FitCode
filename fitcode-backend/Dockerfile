# 1. Temel imaj
FROM node:18

# 2. Uygulama dizinini oluştur
WORKDIR /app

# 3. package.json ve package-lock.json'u kopyala
COPY package*.json ./

# 4. Bağımlılıkları yükle
RUN npm install

# 5. Proje dosyalarını kopyala
COPY . .

# 6. Uygulama portunu aç
EXPOSE 5000

# 7. Başlatma komutu
CMD ["node", "server1.js"]
