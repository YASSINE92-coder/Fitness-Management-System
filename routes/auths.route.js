  import express from "express";
  import passport from "passport";
  import jwt from "jsonwebtoken";
  import {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyCode,
    resendCode,
    me,
  } from "../controllers/auths.controller.js";
  import { validateSignup, validateLogin } from "../middlewares/validation.js";
  /* 
  import { protect } from "../middlewares/Auth.js";
  import { authRole } from "../middlewares/authRole.js"; */
  import { refreshAccessToken } from "../middlewares/refresh.js";
  import { authenticate } from "../middlewares/Auth.js";

  const router = express.Router();

  router.get("/me", authenticate, me);
  router.post("/signup", validateSignup, signup);
  router.post("/login", validateLogin, login);
  router.post("/verify-code", verifyCode);
  router.post("/resend-code", resendCode);
  router.post("/logout", logout);
  router.post("/refresh", refreshAccessToken);
  //routes for password reset
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password/:token", resetPassword);

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
      try {
        const wrapper = req.user || {};
        const payloadUser = wrapper.user || wrapper;
        console.log(payloadUser)
        const accessTokenFromPassport = wrapper.accessToken;
        const refreshTokenFromPassport = wrapper.refreshToken;

        // 1️⃣ Reject deactivated accounts
        if (payloadUser && payloadUser.isActive === false) {
          return res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:3000"}/error`
          );
        }

        // 2️⃣ Validate payload
        if (
          !payloadUser ||
          (!payloadUser.id && !payloadUser._id && !payloadUser.email)
        ) {
          console.error("Google callback: invalid user payload", payloadUser);
          return res.redirect(
            `${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login-success?error=Authentication+failed`
          );
        }

        // 3️⃣ Create safe payload for frontend
        const userForJwt = {
          _id: payloadUser._id || payloadUser.id,
          email: payloadUser.email,
          role: payloadUser.role || "athlete",
        };

      // 4️⃣ Generate fallback access token if passport didn't return one
      const accessTokenJWT =
        accessTokenFromPassport ||
        jwt.sign(
          { id: userForJwt._id, role: userForJwt.role, email: userForJwt.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
        );

      // 5️⃣ Set HttpOnly refresh cookie
      if (refreshTokenFromPassport) {
        res.cookie("refreshToken", refreshTokenFromPassport, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // Use SameSite=None so cookie is sent on cross-site XHR from frontend dev server
          sameSite: "none",
          path: "/", // important so /api/auth/refresh can access it
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      // 6️⃣ Prepare user object for Redux (safe data only)
      const userForFrontend = {
        id: String(userForJwt._id),
        name: payloadUser.name || payloadUser.displayName || "",
        email: userForJwt.email,
        avatar: payloadUser.avatar || payloadUser.photos?.[0]?.value || "",
        role: userForJwt.role || "athlete",
      };

      // 7️⃣ Redirect back to frontend with access token + user JSON
      const encodedUser = encodeURIComponent(JSON.stringify(userForFrontend));

      const redirectUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/login-success?accessToken=${encodeURIComponent(
        accessTokenJWT
      )}&user=${encodedUser}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Error in Google callback:", err);
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/login-success?error=Authentication+failed`
      );
    }
  }
);

  // helper to sign a JWT for a user (kept here to avoid circular imports)
 /*  const generateTokenForUser = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

    if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
    if (!user || !user._id || !user.email)
      throw new Error("Invalid user data for JWT");

    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }; */
  export default router;
