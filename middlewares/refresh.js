import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Refresh Access Token (supports both normal & OAuth users)
 * - Uses HttpOnly cookie for refresh token
 * - Verifies stored refresh tokens in DB
 * - Rotates refresh tokens (old one invalidated)
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    // Verify and decode refresh token
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      console.error("Invalid refresh token:", err);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the token is still stored (rotation/revocation check)
    if (!user.refreshTokens?.includes(oldRefreshToken)) {
      return res.status(403).json({ message: "Refresh token no longer valid" });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    // Rotate the refresh token — remove the old one, store the new one
    user.refreshTokens = user.refreshTokens.filter((t) => t !== oldRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

   // middlewares/refresh.js (when setting the new refresh token)
    res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // dev can be false
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // or "none" in dev if needed
    path: "/", // ensure available to the refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });  

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(500).json({ message: "Server error during token refresh" });
  }
};
