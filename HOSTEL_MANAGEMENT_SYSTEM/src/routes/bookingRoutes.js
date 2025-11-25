import { Router } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { bookRoom, getBookings } from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware(["Student"]), asyncWrapper(bookRoom));
router.get("/", authMiddleware(["Admin","Warden","Student"]), asyncWrapper(getBookings));

export default router;
