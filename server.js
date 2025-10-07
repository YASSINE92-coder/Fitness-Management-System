//express libraries : 
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
//importing files
import connectDB from "./config/db.js";
import globalTryCatch from "./errors/globalTryCatch.js";
import paymentRouter from "./routes/payments.route.js";
import adminProgramRoutes from "./routes/adminProgram.route.js"

import adminRoutes from "./routes/admins.route.js";
import programRouter from "./routes/programs.route.js";
import authRoutes from "./routes/auths.route.js";
import protectedRoutes from "./routes/access.route.js";
import userRoutes from "./routes/users.route.js";
import roleRoutes from "./routes/roles.route.js";
import athleteRoutes from "./routes/athletes.route.js";
import coachRoutes from "./routes/coaches.route.js";
import gymRoutes from "./routes/gyms.route.js";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import athleteConsultationRoutes from "./routes/athleteConsultation.routes.js";

//  Added missing import from your branch

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
});
// Middlewares
app.use(cors({ origin: true, credentials: true }));
//allow access-control-allow-origin from all origins and allow headers like Content-Type, Authorization etc (JWT)  
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
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

// Auth routes 
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", athleteRoutes);
app.use("/api/gyms", gymRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/admin/programs', adminProgramRoutes);
app.use("/api/payments", paymentRouter);

// program routes
app.use("/api/programs", programRouter);
//  Athlete consultation routes (kept from your branch)
app.use("/api/athletes", athleteConsultationRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware
app.use(globalErrorHandler);
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
