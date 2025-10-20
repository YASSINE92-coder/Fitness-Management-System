import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const setupPassport = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn("Google OAuth environment variables are not fully configured");
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
          const email = profile.emails && profile.emails[0] && profile.emails[0].value && profile.emails[0].value.toLowerCase();
          const name = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || "Google User";
          const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;

          // Find existing user by googleId or email
          let user = null;
          if (profile.id) user = await User.findOne({ googleId: profile.id });
          if (!user && email) user = await User.findOne({ email });

          if (user) {
            // ensure googleId/avatar are set
            user.googleId = user.googleId || profile.id;
            user.avatar = user.avatar || avatar;
            user.isVerified = true; // mark verified by Google
            await user.save();
            return done(null, user);
          }

          // Create new user
          const newUser = new User({
            name,
            email,
            password: "", // no local password
            role: "athlete",
            googleId: profile.id,
            avatar,
            isVerified: true,
          });

          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          return done(err, null);
        }
      }
    )
  );

  // Passport serialization (not used for JWT flow but required)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default setupPassport;
