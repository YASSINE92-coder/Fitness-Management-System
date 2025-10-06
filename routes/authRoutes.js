import express from "express";
import { signup, login, logout ,refresh } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";
import { protect } from "../middlewares/Auth.js";
import { authRole } from "../middlewares/authRole.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", protect, logout);
router.post("/refresh", protect, authRole("admin", "user", "coach"), refresh);

export default router;
