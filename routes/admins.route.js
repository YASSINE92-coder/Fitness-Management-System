import express from "express";
import { authRole } from "../middlewares/authRole.js";
import { protect ,authenticate, isAllowed  } from "../middlewares/auth.js";

import {
  getAllUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  getStats,
} from "../controllers/admins.controller.js";

const router = express.Router();

// ========================= ADMIN ROUTES =========================
router.get("/dashboard", protect, authRole("admin"), (req, res) => {
  res.json({ 
    message: `Welcome admin ${req.user.name}`,
    route: "/admin/dashboard",
    permissions: ["All permissions"]
  });
});

router.get(
  "/users"
  ,authenticate,
  isAllowed,
  getAllUsers
);
router.patch("/users/:id/activate",authenticate,isAllowed,activateUser);

router.patch("/users/:id/deactivate",
  authenticate, isAllowed,
    deactivateUser);
router.delete("/users/:id",
   authenticate, isAllowed,
    deleteUser);

router.get(
  "/stats",
  authenticate,
  isAllowed,
  getStats
);

export default router;
