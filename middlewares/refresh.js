import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
