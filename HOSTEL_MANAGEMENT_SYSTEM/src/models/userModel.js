import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Warden", "Student"], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // frontend se password directly accept
}, { timestamps: true });

export default mongoose.model("User", userSchema);
