FROM node:20-bookworm

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV CURL_SSL_NO_VERIFY=1

WORKDIR /app

# 1. Cài Chromium + system libs
RUN apt-get update && apt-get install -y \
  chromium \
  chromium-common \
  chromium-sandbox \
  libnspr4 \
  libnss3 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libgtk-3-0 \
  ca-certificates \
  fonts-liberation \
  redis-server \
  redis-tools \
  && rm -rf /var/lib/apt/lists/*

# Cài font chữ
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  fonts-noto \
  && rm -rf /var/lib/apt/lists/*

# 2. ENV cho Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 3. Copy package.json
COPY package*.json ./

# 4. npm install
RUN npm install

# 5. Copy source
COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "redis-server --daemonize yes && npm run start"
