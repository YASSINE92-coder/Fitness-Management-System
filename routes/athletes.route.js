import express from "express";
import { protect } from "../middlewares/Auth.js";
import { authRole } from "../middlewares/authRole.js";

const router = express.Router();

// ========================= ATHLETE ROUTES =========================
router.get("/athlete/profile", protect, authRole("athlete"), (req, res) => {
  res.json({ 
    message: `Athlete ${req.user.name} profile`, 
    route: "/athlete/profile",
    permissions: ["view_own_profile", "update_own_profile"]
  });
});

router.get("/athlete/programs", protect, authRole("athlete"), (req, res) => {
  res.json({ 
    message: `Athlete ${req.user.name} programs`, 
    route: "/athlete/programs",
    permissions: ["view_own_programs", "buy_programs"]
  });
});

router.get("/athlete/progress", protect, authRole("athlete"), (req, res) => {
  res.json({ 
    message: `Athlete ${req.user.name} progress`, 
    route: "/athlete/progress",
    permissions: ["view_own_progress", "create_own_progress"]
  });
});
export default router;

