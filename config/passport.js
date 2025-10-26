import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";

const setupPassport = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn("⚠️ Google OAuth environment variables are missing");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Normalize email; if Google doesn't return one (rare), create a fallback so
          // Mongoose required validators don't fail when creating the user.
          let email = profile.emails?.[0]?.value;
          if (email) email = String(email).toLowerCase();
          else email = `${profile.id}@google-noemail.local`;
          const name = profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim() || "Google User";
          const avatar = profile.photos?.[0]?.value;

          let user = await User.findOne({ googleId: profile.id }) || (email && await User.findOne({ email }));

          if (user) {
            user.googleId = user.googleId || profile.id;
            user.avatar = user.avatar || avatar;
            user.isVerified = true;
          } else {
            // Ensure password is a non-empty hashed string to satisfy schema `required: true`.
            const randomPwd = crypto.randomBytes(16).toString('hex');
            const hashed = await bcrypt.hash(randomPwd, 10);
            user = new User({
              name,
              email,
              password: hashed,
              role: "athlete",
              googleId: profile.id,
              avatar,
              isVerified: true,
            });
          }

          // Use the same env names used across the app. Fall back to legacy names if present.
          const accessSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
          const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET;

          if (!accessSecret) {
            console.warn("⚠️ JWT access secret (JWT_SECRET) is not set. Google OAuth will still proceed but tokens may be insecure in dev.");
          }

          const accessTokenJWT = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            accessSecret || "dev_access_secret",
            { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
          );

          const refreshTokenJWT = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            refreshSecret || process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
          );

          if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
          user.refreshTokens.push(refreshTokenJWT);
          // If an existing user lacks a password (edge case), ensure it is hashed before saving
          if (!user.password) {
            const randomPwd2 = crypto.randomBytes(16).toString('hex');
            user.password = await bcrypt.hash(randomPwd2, 10);
          }
          await user.save();

          done(null, { 
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role
            },
            accessToken: accessTokenJWT,
            refreshToken: refreshTokenJWT
          });
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          done(err, null);
        }
      }
    )
  );
};

export default setupPassport;
