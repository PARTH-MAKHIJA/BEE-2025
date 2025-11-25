import { Router } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { addRoom, getRooms } from "../controllers/roomController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware(["Admin","Warden"]), asyncWrapper(addRoom));
router.get("/", authMiddleware(["Admin","Warden","Student"]), asyncWrapper(getRooms));

export default router;
