import { Router } from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { registerUser, loginUser, getUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", asyncWrapper(registerUser));
router.post("/login", asyncWrapper(loginUser));
router.get("/:id", authMiddleware(["Admin","Warden","Student"]), asyncWrapper(getUser));

export default router;
