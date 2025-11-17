import { WebSocketServer } from "ws";

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("Client connected!");

    socket.on("message", (message) => {
      console.log("Received:", message.toString());
    });
  });
}

// --- BROADCAST FUNCTION (required by userController.js) ---
export function broadcast(data) {
  if (!wss) {
    console.error("❌ WebSocket not initialized!");
    return;
  }

  const msg = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

export { wss };
