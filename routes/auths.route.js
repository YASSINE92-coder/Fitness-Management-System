import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, logout,forgotPassword, resetPassword, verifyCode, resendCode } from "../controllers/auths.controller.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";
/* 
import { protect } from "../middlewares/Auth.js";
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
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      // Passport strategy returns an object like { user: {...}, accessToken, refreshToken }
      // but some setups may return user directly. Normalize both shapes here.
      const wrapper = req.user || {};
      const payloadUser = wrapper.user || wrapper;
      const accessTokenFromPassport = wrapper.accessToken;
      const refreshTokenFromPassport = wrapper.refreshToken;

	 //  If account is soft-deactivated
      if ( payloadUser && !payloadUser.isActive) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/error`);
      }

      if (!payloadUser || (!payloadUser.id && !payloadUser._id && !payloadUser.email)) {
        console.error('Google callback: invalid user payload', payloadUser);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login-success?error=Authentication+failed`);
      }


      // Ensure we pass an object user with _id and email to the token helper
      const userForJwt = {
        _id: payloadUser._id || payloadUser.id,
        email: payloadUser.email,
        role: payloadUser.role || 'athlete',
      };

      const jwtToken = generateTokenForUser(userForJwt);

      // Build small user object to send to frontend (avoid sending internal fields)
      const userForFrontend = {
        id: String(userForJwt._id),
        name: payloadUser.name || payloadUser.displayName || "",
        email: userForJwt.email,
        avatar: payloadUser.avatar || payloadUser.photos?.[0]?.value || "",
        role: userForJwt.role || "athlete",
      };

      // Set refresh token as httpOnly cookie instead of exposing it in the URL
      if (refreshTokenFromPassport) {
        res.cookie('refreshToken', refreshTokenFromPassport, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      // If passport provided an accessToken (the token we created inside passport strategy), forward it.
      // Fallback to signed jwtToken for accessToken if not provided
      const accessToSend = accessTokenFromPassport || jwtToken;

      const encodedUser = encodeURIComponent(JSON.stringify(userForFrontend));

      const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/login-success?token=${jwtToken}&accessToken=${encodeURIComponent(accessToSend)}&user=${encodedUser}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Error generating JWT after Google auth:", err);
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login-success?error=Authentication+failed`);
    }
  }
);


// helper to sign a JWT for a user (kept here to avoid circular imports)
const generateTokenForUser = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
  if (!user || !user._id || !user.email) throw new Error('Invalid user data for JWT');

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};
export default router;
