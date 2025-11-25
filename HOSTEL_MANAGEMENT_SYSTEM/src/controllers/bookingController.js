import { cache } from "../services/cacheService.js";
import { broadcast } from "../services/websocketService.js";
import { roomsDB } from "./roomController.js";

let bookingsDB = {}; // in-memory storage

export const bookRoom = async (req, res) => {
  if (!req.user || req.user.role !== "Student") {
    return res.status(403).json({ message: "❌ Only Students can book rooms" });
  }

  const { roomId } = req.body;
  const userId = req.user.id;

  if (!roomId) return res.status(400).json({ message: "Room ID required" });

  // Cache-aside pattern
  let room = await cache.get(`room:${roomId}`);
  if (!room) {
    room = roomsDB[roomId]; // fetch from DB
    if (!room) return res.status(404).json({ message: "Room not found" });
    await cache.set(`room:${roomId}`, room, 300); // refill cache
  }

  if (room.booked >= room.capacity)
    return res.status(400).json({ message: "Room full" });

  room.booked += 1;
  roomsDB[roomId] = room;
  await cache.set(`room:${roomId}`, room, 300);

  const bookingId = Date.now().toString();
  const booking = { id: bookingId, userId, roomId };
  bookingsDB[bookingId] = booking;

  broadcast("newBooking", booking);
  res.json({ message: "Room booked", data: booking });
};

export const getBookings = async (req, res) => {
  const bookings = Object.values(bookingsDB);
  res.json({ data: bookings });
};
