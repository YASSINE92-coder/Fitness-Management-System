import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import stripe from "./config/plugins/stripe.js";
import AppError from "./errors/AppError.js";
import globalTryCatch from "./errors/globalTryCatch.js";
import gloabalErrorHandler from "./errors/globalErrorHandler.js";
import paymentRouter from "./routes/payments.route.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(globalTryCatch);

// Routes

app.get("/", (req, res) => {
  throw new AppError("test", 404, { name: "youssef" });
  res.json({ message: "Welcome to my Express backend!" });
});
app.use("/api", paymentRouter);

// Error Handler
app.use(gloabalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
