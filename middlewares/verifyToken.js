import jwt from "jsonwebtoken";
import User from "../models/User.js";

// verifyToken middleware: checks Authorization header for Bearer token, verifies it,
// fetches the user and attaches it to req.user. Returns 401/403 for invalid/missing tokens.
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default verifyToken;
