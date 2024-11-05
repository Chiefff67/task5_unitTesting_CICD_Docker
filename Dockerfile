# Gunakan node versi LTS
FROM node:18-alpine

# Buat direktori app
WORKDIR /usr/src/app

# Install dependensi terlebih dahulu untuk memanfaatkan Docker cache
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port yang digunakan aplikasi
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]