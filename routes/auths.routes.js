import express from "express";
import { signup, login, logout ,refresh } from "../controllers/auths.controller.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/refresh", protect, authRole("admin", "athlete", "coach", "gym"), refresh);

export default router;
