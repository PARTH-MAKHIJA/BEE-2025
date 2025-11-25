import express from "express";
import {
  createGatepass,
  getPendingGatepasses,
  approveGatepass,
  rejectGatepass,
  getMyGatepasses
} from "src/controllers/gatepassController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Student: create
router.post("/", authMiddleware(["Student"]), createGatepass);

// Student: view own
router.get("/mine", authMiddleware(["Student"]), getMyGatepasses);

// Warden/Admin: view pending
router.get("/pending", authMiddleware(["Admin", "Warden"]), getPendingGatepasses);

// Warden/Admin: approve/reject
router.patch("/:id/approve", authMiddleware(["Admin", "Warden"]), approveGatepass);
router.patch("/:id/reject", authMiddleware(["Admin", "Warden"]), rejectGatepass);

export default router;
