import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/Fitness_management_system";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Could not connect to MongoDB", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;   