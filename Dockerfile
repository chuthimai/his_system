FROM node:20

WORKDIR /app

# 1. System libs cho Chromium
RUN apt-get update && apt-get install -y \
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
  && rm -rf /var/lib/apt/lists/*

# 2. ENV cho Puppeteer
ENV PUPPETEER_SKIP_SANDBOX=true
ENV PUPPETEER_EXECUTABLE_PATH=/root/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome

# 3. Copy package.json
COPY package*.json ./

# 4. npm install (puppeteer download chrome)
RUN npm install

# 5. Copy source
COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "npm run typeorm:run-migration && npm run seed && npm run start"
