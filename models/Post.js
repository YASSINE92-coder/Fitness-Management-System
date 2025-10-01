import mongoose from "mongoose";
import commentSchema from './Comment.js'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media: {
      type: String,
    },
    media_type: {
      type: String,
      enum: ["image", "video", "pdf", "event"],
      required: true,
    },
    comments: [commentSchema],
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
