import mongoose from "mongoose";
import Comment from "../models/Comment.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const newComment = new mongoose.model("Comment", Comment)({
      user_id: req.user.id,
      content,
      likes: 0
    });

    await newComment.save();

    // Populate user data
    const populatedComment = await mongoose.model("Comment", Comment)
      .findById(newComment._id)
      .populate("user_id", "name email");

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await mongoose.model("Comment", Comment)
      .find()
      .populate("user_id", "name email")
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await mongoose.model("Comment", Comment).findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Increment likes
    comment.likes += 1;
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unlike a comment
export const unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await mongoose.model("Comment", Comment).findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Decrement likes, but ensure it doesn't go below 0
    if (comment.likes > 0) {
      comment.likes -= 1;
      await comment.save();
    }
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get likes count for a comment
export const getCommentLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await mongoose.model("Comment", Comment).findById(id).select("likes");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ success: true, likes: comment.likes });
  } catch (error) {
    console.error("Error getting comment likes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};