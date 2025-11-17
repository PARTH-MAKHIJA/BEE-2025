import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
