import { cache } from "../services/cacheService.js";
import { broadcast } from "../services/websocketService.js";

export let roomsDB = {}; // Make sure exported

export const addRoom = async (req, res) => {
  if (!req.user || !["Admin", "Warden"].includes(req.user.role)) {
    return res.status(403).json({ message: "❌ Access denied: Only Admin/Warden can add rooms" });
  }

  const { name, capacity } = req.body;
  if (!name || !capacity) return res.status(400).json({ message: "All fields required" });

  const id = Date.now().toString();
  const room = { id, name, capacity, booked: 0 };
  roomsDB[id] = room;

  await cache.set(`room:${id}`, room, 300);
  broadcast("newRoom", room);

  return res.status(201).json({ message: "Room added", data: room });
};

export const getRooms = async (req, res) => {
  const rooms = Object.values(roomsDB);
  return res.json({ data: rooms });
};
