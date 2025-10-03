import mongoose from "mongoose";

import certificateSchema from "./Certificate.js";
import profileDataSchema from "./ProfileData.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    fitness_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    alergies: [
      {
        type: String,
      },
    ],
    activity_frequency: {
      type: String,
      enum: ["active", "moderate", "sedentary"],
    },
    profile: profileDataSchema,
    goals: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "general"],
    },
    bought_programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    // Coach specific fields
    cin: {
      type: String,
      sparse: true, // Only required for coaches
    },
    certificats: [certificateSchema],
    years_of_experience: {
      type: Number,
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add validation for coach-specific fields
userSchema.pre("save", function (next) {
  if (this.role === "coach") {
    if (!this.cin) {
      throw new Error("CIN is required for coaches");
    }
    if (!this.years_of_experience) {
      throw new Error("Years of experience is required for coaches");
    }
  }
  next();
});
const User = mongoose.model("User", userSchema);
export default User;
