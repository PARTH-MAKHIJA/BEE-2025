// src/controllers/userController.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { cache } from "../services/cacheService.js";
import { addJob } from "../services/queueService.js";
import { broadcast } from "../services/websocketService.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, role, email, password } = req.body;
    if (!name || !role || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.create({ name, role, email, password });

    // Cache set
    await cache.set(`user:${user._id}`, user, 300);

    // Redis publish
    await cache.publish("userAdded", JSON.stringify(user));

    // Queue add
   await addJob({
  email: user.email,
  subject: "Welcome to Hostel Management System",
  message: `Hi ${user.name}, your account has been created as ${user.role}.`,
});


    // WebSocket broadcast
    broadcast("newUser", { id: user._id, name: user.name, role: user.role });

    res.status(201).json({ message: "User registered", data: user });
  } catch (err) {
    next(err);
  }
};

// =============================
// LOGIN USER
// =============================
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // WebSocket broadcast on login
    broadcast("login", { id: user._id, name: user.name, role: user.role });

    res.json({ message: "Login successful", token, data: { id: user._id, name: user.name, role: user.role } });
    console.log("Login response:", { message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

// =============================
// GET USER BY ID
// =============================
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await cache.get(`user:${id}`);
    if (!user) {
      user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await cache.set(`user:${id}`, user, 300);
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};
