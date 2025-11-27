# 1. Altyapı: Node.js (Linux + Node)
FROM node:20-alpine

# 2. Çalışma Klasörü
WORKDIR /app

# 3. Paket Listesini Kopyala (package.json)
COPY package.json .

# 4. Paketleri İndir (npm install)
RUN npm install

# 5. Tüm kodları içeri al
COPY . .

# 6. Dışarıdan erişim için portu aç (Vite varsayılanı 5173)
EXPOSE 5173

# 7. Başlat (Host parametresini ekliyoruz ki Docker dışından erişilebilsin)
CMD ["npm", "run", "dev", "--", "--host"]