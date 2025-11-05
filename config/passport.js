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
          let email = profile.emails?.[0]?.value?.toLowerCase() || `${profile.id}@google-noemail.local`;
          const name = profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim() || "Google User";
          const avatar = profile.photos?.[0]?.value;

          let user = await User.findOne({ googleId: profile.id }) || (email && await User.findOne({ email }));

          if (!user) {
            const randomPwd = crypto.randomBytes(16).toString("hex");
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
          } else {
            user.googleId = user.googleId || profile.id;
            user.avatar = user.avatar || avatar;
            user.isVerified = true;
          }

          // Save user first to ensure _id exists
          await user.save();

          const accessSecret = process.env.JWT_SECRET || "dev_access_secret";
          const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";

          const accessTokenJWT = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            accessSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
          );

          const refreshTokenJWT = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            refreshSecret,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
          );

          // Save refresh token persistently
          if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
          user.refreshTokens.push(refreshTokenJWT);
          await user.save();

          done(null, {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role,
            },
            accessToken: accessTokenJWT,
            refreshToken: refreshTokenJWT,
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
