import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    assigned_by: {
      type: String,
      required: false,
    },
    issued_at: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default certificateSchema;
