import mongoose from "mongoose";

const profileDataSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
});

export default profileDataSchema;
