import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, logout,forgotPassword, resetPassword, verifyCode, resendCode } from "../controllers/auths.controller.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";
/* 
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js"; */
import { refreshAccessToken } from "../middlewares/refresh.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
//routes for password reset
router.post("/forgot-password",forgotPassword );
router.post("/reset-password/:token",resetPassword);

// Google OAuth routes
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login-success?error=Authentication+failed` }),
	(req, res) => {
		// Successful authentication, sign JWT and redirect to frontend with token
		try {
			const jwt = generateTokenForUser(req.user);
			const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login-success?token=${jwt}`;
			return res.redirect(redirectUrl);
		} catch (err) {
			console.error('Error generating JWT after Google auth:', err);
			return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login-success?error=Authentication+failed`);
		}
	}
);

// helper to sign a JWT for a user (kept here to avoid circular imports)
const generateTokenForUser = (user) => {
	const JWT_SECRET = process.env.JWT_SECRET;
	const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
	if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
	return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export default router;
