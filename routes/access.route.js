import express from "express";
import { authPermission, authRoleOrHigher } from "../middlewares/authRole.js";

const router = express.Router();
import { protect } from "../middlewares/auth.js";
// ========================= PERMISSION-BASED ROUTES =========================
// Routes that require specific permissions regardless of role
router.get("/workouts", protect, authPermission("view_own_workouts"), (req, res) => {
  res.json({ 
    message: `Workouts for ${req.user.name}`, 
    route: "/workouts",
    userRole: req.user.role 
  });
});

router.get("/statistics", protect, authRoleOrHigher("gym"), (req, res) => {
  res.json({ 
    message: `Statistics for ${req.user.name}`, 
    route: "/statistics",
    userRole: req.user.role,
    permissions: ["view_gym_statistics", "view_system_statistics"]
  });
});

export default router;


