  import mongoose from "mongoose";
  import certificateSchema from "./Certificate.js";
  import profileDataSchema from "./ProfileData.js";

  const userSchema = new mongoose.Schema(
    {
      // ===== BASIC INFO (for Register) =====
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ["athlete", "coach", "gym", "admin"],
        default: "athlete",
      },

      // ===== OPTIONAL FIELDS =====
      gender: { type: String, enum: ["male", "female"], default: null },
      height: { type: Number, default: null },
      weight: { type: Number, default: null },
      fitness_level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      allergies: { type: [String], default: null },
      activity_frequency: {
        type: String,
        enum: ["active", "moderate", "sedentary"],
      },
      profile: { type: profileDataSchema, default: null },
      goals: {
        type: String,
        enum: ["weight_loss", "muscle_gain", "endurance", "general"],
        default: null,
      },
      bought_programs: { type: [mongoose.Schema.Types.ObjectId], ref: "Program", default: null },

      // ===== COACH-SPECIFIC FIELDS =====
      cin: { type: String, sparse: true, unique: true, default: null },
      certificates: { type: [certificateSchema], default: null },
      years_of_experience: { type: Number, default: null },
      speciality: { type: String, default: null },

      // ===== SYSTEM FLAGS =====
      isActive: { type: Boolean, default: true },
      is_Approved: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },

      // ===== RELATIONS =====
      programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],

      // ===== AUTH & SECURITY =====
      refreshTokens: { type: [String], default: [] },
      resetPasswordToken: String,
      resetPasswordExpire: Date,

      // ===== EMAIL VERIFICATION =====
      verificationCode: String,
      verificationCodeExpires: Date,
      
      // ===== GOOGLE OAUTH =====
      googleId: { type: String, index: true, sparse: true },
      avatar: String,
    },
    { timestamps: true }
  );

  /* // ===== VALIDATION FOR COACHES =====
  userSchema.pre("save", function (next) {
    if (this.role === "coach") {
      if (!this.cin || !this.years_of_experience) {
        const error = new mongoose.Error.ValidationError(this);
        if (!this.cin)
          error.addError(
            "cin",
            new mongoose.Error.ValidatorError({
              message: "CIN is required for coaches",
            })
          );
        if (!this.years_of_experience)
          error.addError(
            "years_of_experience",
            new mongoose.Error.ValidatorError({
              message: "Years of experience is required for coaches",
            })
          );
        return next(error);
      }
    }
    next();
  });
  */
  // ===== INDEXES =====
  userSchema.index({ email: 1 });
  userSchema.index({ cin: 1 });

  const User = mongoose.model("User", userSchema);
  export default User;
