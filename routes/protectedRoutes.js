import express from "express";
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js";

const router = express.Router();

// Admin only
router.get("/admin/dashboard", protect, authRole("admin"), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}`, route: "/admin/dashboard" });
});

// Coach only
router.get("/coach/athletes", protect, authRole("coach"), (req, res) => {
  res.json({ message: `Coach ${req.user.name} athletes`, route: "/coach/athletes" });
});

// Gym only
router.get("/gym/events", protect, authRole("gym"), (req, res) => {
  res.json({ message: `Gym ${req.user.name} events`, route: "/gym/events" });
});

// Athlete only
router.get("/athlete/profile", protect, authRole("athlete"), (req, res) => {
  res.json({ message: `Athlete ${req.user.name} profile`, route: "/athlete/profile" });
});

export default router;


