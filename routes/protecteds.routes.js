import express from "express";
import { protect } from "../middlewares/auth.js";
import { authRole, authPermission, authRoleOrHigher } from "../middlewares/authRole.js";

const router = express.Router();

// ========================= ADMIN ROUTES =========================
router.get("/admin/dashboard", protect, authRole("admin"), (req, res) => {
  res.json({ 
    message: `Welcome admin ${req.user.name}`, 
    route: "/admin/dashboard",
    permissions: ["All permissions"]
  });
});

// ========================= COACH ROUTES =========================
router.get("/coach/athletes", protect, authRole("coach"), (req, res) => {
  res.json({ 
    message: `Coach ${req.user.name} athletes`, 
    route: "/coach/athletes",
    permissions: ["view_athletes", "view_athlete_progress"]
  });
});

router.get("/coach/programs", protect, authRole("coach"), (req, res) => {
  res.json({ 
    message: `Coach ${req.user.name} programs`, 
    route: "/coach/programs",
    permissions: ["create_programs", "update_own_programs", "delete_own_programs"]
  });
});

// ========================= GYM ROUTES =========================
router.get("/gym/events", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} events`, 
    route: "/gym/events",
    permissions: ["create_events", "update_events", "delete_events", "view_events"]
  });
});

router.get("/gym/members", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} members`, 
    route: "/gym/members",
    permissions: ["view_members"]
  });
});

router.get("/gym/equipment", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} equipment`, 
    route: "/gym/equipment",
    permissions: ["manage_equipment"]
  });
});

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


