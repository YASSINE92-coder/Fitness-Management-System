import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profiles.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Integration note: Frontend should call GET /api/user/profile with Authorization: Bearer <token>
// to fetch the authenticated user's profile for display in the UserMenu.
router.get("/user/profile", verifyToken ,getProfile);
// Integration note: Frontend should call PUT /api/user/prof ile with Authorization header and
// a JSON body containing fields to update (e.g. name, gender, avatar). Password updates
// should go through the password reset/change flow instead.
router.put("/user/profile", verifyToken, updateProfile);
router.put("/user/delete", verifyToken, deleteProfile);

export default router;
