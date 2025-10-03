import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

import User from "../models/User.js";
import Program from "../models/Program.js";
import Post from "../models/Post.js";
import Gym from "../models/Gym.js";
import Equipment from "../models/Equipment.js";

import seedEquipments from "./modules/equipments.js";
import seedCoach from "./modules/coach.js";
import seedUser from "./modules/user.js";
import seedPrograms from "./modules/programs.js";
import seedPosts from "./modules/posts.js";
import seedGyms from "./modules/gyms.js";

// load env
dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data (optional)
    await Promise.all([
      User.deleteMany({}),
      Program.deleteMany({}),
      Post.deleteMany({}),
      Gym.deleteMany({}),
      Equipment.deleteMany({}),
    ]);

    // Run modular seeders
    const equipments = await seedEquipments();
    const coach = await seedCoach();
    const user = await seedUser();
    const programs = await seedPrograms(coach._id);

    // Link programs
    coach.programs = programs.map((p) => p._id);
    await coach.save();

    user.bought_programs = [programs[0]._id];
    await user.save();

    const post = await seedPosts(user._id, coach._id);
    const gym = await seedGyms(
      equipments.map((e) => e._id),
      coach._id
    );

    console.log("Seed completed.");
    console.log({
      users: 2,
      programs: programs.length,
      posts: 1,
      gyms: 1,
      equipments: equipments.length,
    });
  } catch (err) {
    console.error("Seed error: ", err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
