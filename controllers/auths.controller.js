import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {sendEmail} from "../utils/sendEmail.js";


// Helper to generate 6-digit code
const generate6DigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// ========================= SIGNUP + SEND VERIFICATION CODE =========================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code & expiry (10 minutes)
    const verificationCode = generate6DigitCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    // Generate refresh token & save
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens = [refreshToken];
    await user.save();

    // Send verification email
    try {
      await sendEmail(
        user.email,
        "Email Verification Code",
        `<p>Hello ${user.name},</p>
         <p>Your verification code is: <strong>${verificationCode}</strong></p>
         <p>This code expires in 10 minutes.</p>`
      );
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
    }

    // Set HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Success
    return res.status(201).json({
      message: "User registered. Verification code sent to email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= VERIFY CODE =========================
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ message: "No verification code found. Request a new one." });
    }

    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (new Date(user.verificationCodeExpires).getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyCode error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= RESEND CODE =========================
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verificationCode = generate6DigitCode();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(verificationCodeExpires);
    user.isVerified = false;
    await user.save();

    try {
      await sendEmail(
        user.email,
        "Email Verification Code",
        `<p>Hello ${user.name},</p>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code expires in 10 minutes.</p>`
      );
    } catch (emailErr) {
      console.error("Failed to send verification email (resend):", emailErr);
      // don't fail the request because of email delivery issues
    }

    return res.json({ message: "A new verification code has been sent" });
  } catch (err) {
    console.error("resendCode error:", err);
    return res.status(500).json({ message: "Server error" });
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

    // Prevent login if email not verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

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
// ======== FORGOT PASSWORD ========
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1h

  // Use the schema fields: resetPasswordToken and resetPasswordExpire
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(resetTokenExpires);
    await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>Hi ${user.name},</p>
      <p>Click below to reset your password (valid 1 hour):</p>
      <a href="${resetLink}">Reset Password</a>`
    );

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

// ======== RESET PASSWORD ========
export const resetPassword = async (req, res) => {
  try {
    // Accept token from params, body, or query (makes frontend integration more tolerant)
    let token = req.params.token || req.body.token || req.query.token;
    const id = req.body.id || req.query.id;
    const newPassword = req.body.newPassword;

    if (!token) return res.status(400).json({ message: "Reset token is required (params, body or query)" });
    if (!id) return res.status(400).json({ message: "User id is required (body or query)" });
    if (!newPassword) return res.status(400).json({ message: "newPassword is required in request body" });

    // decode in case frontend encoded the token
  try { token = decodeURIComponent(String(token)); } catch (decodeErr) { console.debug('token decode error', decodeErr); }
    token = String(token).trim();

    // Find user by id first so we can provide better diagnostics
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const storedToken = user.resetPasswordToken || user.passwordResetToken;
    const storedExpire = user.resetPasswordExpire || user.passwordResetExpires;

    // Debug logs to help identify mismatches (safe: logs lengths and existence only)
    console.debug(`resetPassword attempt for id=${id} tokenLen=${token.length} storedTokenExists=${!!storedToken} storedExpire=${storedExpire}`);

    if (!storedToken) return res.status(401).json({ message: "No reset token stored for this user" });
    if (storedToken !== token) return res.status(401).json({ message: "Invalid reset token" });

    if (storedExpire && new Date(storedExpire).getTime() < Date.now()) {
      return res.status(401).json({ message: "Reset token has expired" });
    }

    // All good: hash and update password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear reset fields (support both naming conventions)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Server error" });
  }
};