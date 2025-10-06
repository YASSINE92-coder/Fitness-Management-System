import express from "express";
import { signup, login, logout } from "../controllers/auths.controller.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";
/* 
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js"; */
import { refreshAccessToken } from "../middlewares/refresh.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);

export default router;
