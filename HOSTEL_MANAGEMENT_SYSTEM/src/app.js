// src/app.js
import express from "express";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
const __dirname = path.resolve(); // works with ESM
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handler
app.use(errorHandler);

export default app;
