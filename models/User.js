import mongoose from "mongoose";

import certificateSchema from "./Certificate.js";
import profileDataSchema from "./ProfileData.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["athlete", "coach", "gymOwner", "admin"],
      default: "athlete",
    },
    gender: { type: String, enum: ["male", "female"], required: true },
    height: { type: Number },
    weight: { type: Number },
    fitness_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    allergies: [{ type: String }],
    activity_frequency: {
      type: String,
      enum: ["active", "moderate", "sedentary"],
    },
    profile: profileDataSchema,
    goals: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "general"],
    },
    bought_programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    cin: { type: String, sparse: true , unique: true}, // Coach Identification Number
    certificates : [certificateSchema],
    years_of_experience: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    is_Approved: {
      type: Boolean,
      default: false,
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    refreshTokens: {
      type: [String],
      default: []
    },
    
  },
  
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.role === "coach") {
    if (!this.cin || !this.years_of_experience) {
      const error = new mongoose.Error.ValidationError(this);
      if (!this.cin) error.addError("cin", new mongoose.Error.ValidatorError({ message: "CIN is required for coaches" }));
      if (!this.years_of_experience) error.addError("years_of_experience", new mongoose.Error.ValidatorError({ message: "Years of experience is required for coaches" }));
      return next(error);
    }
  }
  next();
});
userSchema.index({ email: 1 });
userSchema.index({ cin: 1 });

const User = mongoose.model("User", userSchema);  
export default User;
