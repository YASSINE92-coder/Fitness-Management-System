//express libraries :
import express from "express";
import cors from "cors";
//import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import passport from "passport";
import setupPassport from "./config/passport.js";

//importing files
import connectDB from "./config/db.js";
import globalTryCatch from "./errors/globalTryCatch.js";
import paymentRouter from "./routes/payments.route.js";
import adminProgramRoutes from "./routes/adminProgram.route.js";
import adminRoutes from "./routes/admins.route.js";
import programRouter from "./routes/programs.route.js";
import authRoutes from "./routes/auths.route.js";
import protectedRoutes from "./routes/access.route.js";
import userRoutes from "./routes/users.route.js";
import profileRoutes from "./routes/profiles.route.js";
import roleRoutes from "./routes/roles.route.js";
import athleteRoutes from "./routes/athletes.route.js";
import coachRoutes from "./routes/coaches.route.js";
import gymRoutes from "./routes/gyms.route.js";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import athleteConsultationRoutes from "./routes/athleteConsultation.routes.js";
import { cloudinarConnection } from "./utils/cloudinary.js";
import commentsRoutes from "./routes/comments.route.js";

//  Added missing import from your branch

// Load environment variables
dotenv.config();

// Connect to MongoDB

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
// Disable ETag so dynamic JSON endpoints (e.g., /api/auth/me) don't return 304
app.set("etag", false);
/* const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
}); */
// Middlewares
// Allow only the configured frontend origin and allow credentials (cookies)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
//allow access-control-allow-origin from all origins and allow headers like Content-Type, Authorization etc (JWT)
app.use(helmet());
// Increase body limits to allow small base64 images in JSON (avatars)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use('/uploads/programs/images', express.static('uploads'));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(globalTryCatch);
//app.use(limiter);
// Initialize passport for OAuth routes
setupPassport();
app.use(passport.initialize());

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
// Mount simple profile routes (GET/PUT /api/user/profile)
app.use("/api", profileRoutes);
app.use("/api", roleRoutes);
app.use("/api", athleteRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/admin/programs", adminProgramRoutes);
app.use("/api/payments", paymentRouter);
app.use("/api/payments", paymentRouter);

// program routes
app.use("/api/programs", programRouter);
//  Athlete consultation routes (kept from your branch)
app.use("/api/athletes", athleteConsultationRoutes);
// Comments routes
app.use("/api/comments", commentsRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware
app.use(globalErrorHandler);

await connectDB();
await cloudinarConnection();
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
