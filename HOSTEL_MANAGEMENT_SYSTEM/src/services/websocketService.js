import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

let wss = null;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected!");

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);

        if (data.token) {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          ws.role = decoded.role;
          ws.userId = decoded.id;
        }
      } catch (err) {
        console.log("WS token decode error:", err.message);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected!");
    });
  });

  console.log("WebSocket initialized");
};

export function broadcast(event, payload, roles = []) {
  if (!wss) return;

  const msg = JSON.stringify({ event, payload });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      if (roles.length === 0 || roles.includes(client.role)) {
        client.send(msg);
      }
    }
  });
}
