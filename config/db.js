import mongoose from "mongoose";
import {config} from "dotenv"
config()

const MONGODB_URI = process.env.DATABASE_URL;
if(!MONGODB_URI) throw new Error("database url not valide")
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