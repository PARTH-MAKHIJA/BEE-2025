import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import http from "http";
import app from "./app.js";
import { initWebSocket } from "./services/websocketService.js";
import { initCache } from "./services/cacheService.js"; // new

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // 1) initialize redis (publisher + subscriber)
    await initCache(process.env.REDIS_URL);
    // optional: you can subscribe to channels here if needed
    // e.g. import { cache } from "./services/cacheService.js"; await cache.subscribe("user-events", handler);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const server = http.createServer(app);
    initWebSocket(server);

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
