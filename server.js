import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import stripe from "./config/plugins/stripe.js";
import AppError from "./errors/AppError.js";
import globalTryCatch from "./errors/globalTryCatch.js";
import gloabalErrorHandler from "./errors/globalErrorHandler.js";
import paymentRouter from "./routes/payments.route.js";
import morgan from "morgan";
import adminRoutes from "./routes/admin.route.js";

// ✅ Added missing import from your branch
import athleteConsultationRoutes from "./routes/athleteConsultation.routes.js";

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
app.use(morgan("dev"));
app.use(globalTryCatch);
app.use(limiter);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express backend!" });
});

// Admin routes
app.use("/api/admin", adminRoutes);

// Payment routes
app.use("/api", paymentRouter);

// Auth routes 
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", userRoutes);

// ✅ Athlete consultation routes (kept from your branch)
app.use("/api/athletes", athleteConsultationRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(gloabalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
