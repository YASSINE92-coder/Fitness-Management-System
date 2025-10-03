import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Program from "../models/Program.js";
import User from "../models/User.js";
import { createFakePrograms } from "./fakers/program.js";
import { createFakeUser, createFakeUsers } from "./fakers/user.js";
connectDB();

const userSeed = async (count = 1) => {
  const users = await User.insertMany(createFakeUsers(count));
  console.log("user seeded", users.length);
};

const programSeed = async (count = 1) => {
  const coach = await User.insertOne(createFakeUser("coach"));
  const programs = await Program.insertMany(
    createFakePrograms(coach._id, count)
  );
  console.log("program seeded", programs.length);
};
const seed = async () => {
  try {
    await programSeed(3);
    await userSeed(1);
  } catch (error) {
    console.log(error.message);
  } finally {
    await mongoose.disconnect();
  }
};
seed();
