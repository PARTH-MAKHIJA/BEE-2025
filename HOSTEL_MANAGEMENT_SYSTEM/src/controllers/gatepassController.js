import Gatepass from "../models/gatepassModel.js";
import User from "../models/userModel.js";
import { broadcast } from "../services/websocketService.js";
import { addJob } from "../services/queueService.js";

export const createGatepass = async (req, res) => {
  const { reason, fromDate, toDate } = req.body;

  const gatepass = await Gatepass.create({
    userId: req.user.id,
    reason,
    fromDate,
    toDate
  });

  broadcast("GATEPASS_CREATED", gatepass, ["Admin", "Warden"]);

  res.status(201).json({ message: "Request submitted", gatepass });
};

export const getPendingGatepasses = async (req, res) => {
  const pending = await Gatepass.find({ status: "PENDING" }).populate("userId");
  res.json({ pending });
};

export const approveGatepass = async (req, res) => {
  const { id } = req.params;

  const gatepass = await Gatepass.findByIdAndUpdate(
    id,
    { status: "APPROVED", approvedBy: req.user.id },
    { new: true }
  ).populate("userId");

  if (!gatepass) return res.status(404).json({ message: "Not found" });

  // Notify student
  broadcast("GATEPASS_STATUS", gatepass, ["Student"]);

  // Queue email job
  addJob({
    email: gatepass.userId.email,
    subject: "Gatepass Approved",
    message: `Your gatepass has been approved.`
  });

  res.json({ message: "Gatepass approved", gatepass });
};

export const rejectGatepass = async (req, res) => {
  const { id } = req.params;

  const gatepass = await Gatepass.findByIdAndUpdate(
    id,
    { status: "REJECTED", approvedBy: req.user.id },
    { new: true }
  ).populate("userId");

  if (!gatepass) return res.status(404).json({ message: "Not found" });

  broadcast("GATEPASS_STATUS", gatepass, ["Student"]);

  addJob({
    email: gatepass.userId.email,
    subject: "Gatepass Rejected",
    message: `Your gatepass has been rejected.`
  });

  res.json({ message: "Gatepass rejected", gatepass });
};

export const getMyGatepasses = async (req, res) => {
  const list = await Gatepass.find({ userId: req.user.id });
  res.json({ list });
};
