FROM node:20-alpine

WORKDIR /app

# Needed to build better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++

COPY package.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p /app/data

ENV PORT=4000
ENV DB_PATH=/app/data/cv.db

EXPOSE 4000

CMD ["sh", "-c", "node src/seed.js && node src/index.js"]
