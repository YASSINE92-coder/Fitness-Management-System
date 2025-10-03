import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(limiter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express backend!" });
});

// Auth routes (avant le 404 handler)
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
