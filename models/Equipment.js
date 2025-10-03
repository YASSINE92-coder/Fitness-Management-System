import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Equipment = mongoose.model("Equipment", equipmentSchema)
export default Equipment;
