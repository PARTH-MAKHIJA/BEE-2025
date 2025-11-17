// src/services/cacheService.js
import { createClient } from "redis";

let client;        // used for set/get/publish
let subscriber;    // used for subscribe separately

export async function initCache(url = process.env.REDIS_URL) {
  if (client) return; // already initialized

  client = createClient({ url });
  client.on("error", (err) => console.error("Redis client error:", err));
  await client.connect();
  console.log("Redis: publisher client connected");

  // create a separate subscriber (must be a separate connection)
  subscriber = client.duplicate();
  subscriber.on("error", (err) => console.error("Redis subscriber error:", err));
  await subscriber.connect();
  console.log("Redis: subscriber client connected");
}

// simple cache helpers
export const cache = {
  set: async (key, value, ttl = 300) => {
    if (!client) throw new Error("Redis client not initialized. Call initCache()");
    await client.set(key, JSON.stringify(value), { EX: ttl });
  },
  get: async (key) => {
    if (!client) throw new Error("Redis client not initialized. Call initCache()");
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },
  // publish to a channel
  publish: async (channel, message) => {
    if (!client) throw new Error("Redis client not initialized. Call initCache()");
    await client.publish(channel, typeof message === "string" ? message : JSON.stringify(message));
  },
  // subscribe: handler receives parsed message and raw
  subscribe: async (channel, handler) => {
    if (!subscriber) throw new Error("Redis subscriber not initialized. Call initCache()");
    await subscriber.subscribe(channel, (rawMessage) => {
      try {
        const parsed = JSON.parse(rawMessage);
        handler(parsed, rawMessage);
      } catch {
        handler(rawMessage, rawMessage);
      }
    });
  },
};
