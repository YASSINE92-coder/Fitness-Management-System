import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

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

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express backend!" });
});

// ✅ Gym routes
import gymRoutes from "./routes/gyms.routes.js";
app.use("/api/gyms", gymRoutes);

// Coach routes
import coachRoutes from './routes/coaches.routes.js';
app.use('/api/coaches', coachRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});