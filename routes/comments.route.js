import express from "express";
import { createComment, getAllComments, likeComment, unlikeComment, getCommentLikes } from "../controllers/comments.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Comment routes
router.get("/", getAllComments);
router.get("/:id/likes", getCommentLikes);

// Apply authentication middleware to all routes
router.use(verifyToken);
router.post("/", createComment);
router.post("/:id/like", likeComment);
router.post("/:id/unlike", unlikeComment);

export default router;