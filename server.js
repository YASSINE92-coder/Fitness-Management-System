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
import authRoutes from "./routes/auths.route.js";
import protectedRoutes from "./routes/access.route.js";
import userRoutes from "./routes/users.route.js";
import roleRoutes from "./routes/roles.route.js";
import athleteRoutes from "./routes/athletes.route.js";
import coachRoutes from "./routes/coaches.route.js";
import gymRoutes from "./routes/gyms.route.js";
import paymentRouter from "./routes/payments.route.js";
import adminRoutes from "./routes/admins.route.js";
import globalTryCatch from "./errors/globalTryCatch.js";
import globalErrorHandler from "./errors/globalErrorHandler.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
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

// test
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express backend!" });
});

//admin route
app.use("/api/admin", adminRoutes);

//payment route
app.use("/api", paymentRouter);

// Auth routes 
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", athleteRoutes);
app.use("/api", coachRoutes);
app.use("/api", gymRoutes);

// Global error handling middleware
app.use(globalErrorHandler);
// Start server 
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
