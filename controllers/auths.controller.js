import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ROLES, ROLE_VALIDATION } from "../utils/roles.js";

// Generate Access Token
const generateAccessToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  console.log(JWT_EXPIRES_IN);

  if (!JWT_SECRET || !JWT_EXPIRES_IN)
    throw new Error("JWT secrets are not configured");
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
  if (!JWT_REFRESH_SECRET || !JWT_REFRESH_EXPIRES_IN)
    throw new Error("JWT secrets are not configured");
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

// ========================= SIGNUP =========================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, gender , cin, years_of_experience } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Validate role-specific required fields
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role",
        validRoles: Object.values(ROLES)
      });
    }

    const roleValidation = ROLE_VALIDATION[role];
    const missingFields = roleValidation.required.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields for ${role} role`,
        missing: missingFields,
        required: roleValidation.required
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      cin,
      years_of_experience
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshTokens = [refreshToken];
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= LOGIN =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshTokens = [refreshToken];
    await user.save();

    // Set refresh token cookie (for browsers/front-end)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return access token in JSON (for REST clients)
    res.json({
      accessToken, // <- this is what your .rest file can use
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ========================= REFRESH TOKEN =========================
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// ========================= LOGOUT =========================
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.id);

      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({ message: "Logged out successfully" });
};
