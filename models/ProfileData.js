import mongoose from "mongoose";

const profileDataSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  social_links: {
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
  },
});

export default profileDataSchema;
