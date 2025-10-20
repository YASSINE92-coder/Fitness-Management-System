import express from "express";
import { protect } from "../middlewares/Auth.js";
import { authRole } from "../middlewares/authRole.js";
import {
  getAllRoles,
  getRolePermissions,
  checkUserPermissions,
  updateUserRole,
  getUsersByRole,
  getRoleStatistics,
  approveUser,
  toggleUserStatus
} from "../controllers/roles.controller.js";

const router = express.Router();

// ========================= PUBLIC ROUTES =========================
// Get all available roles (public for registration)
router.get("/roles", getAllRoles);

// Get specific role permissions (public for registration)
router.get("/roles/:role/permissions", getRolePermissions);

// ========================= PROTECTED ROUTES =========================
// Check user permissions (any authenticated user)
router.post("/users/:userId/permissions", protect, checkUserPermissions);

// ========================= ADMIN ROUTES =========================
// Get users by role (admin only)
router.get("/roles/:role/users", protect, authRole("admin"), getUsersByRole);

// Get role statistics (admin only)
router.get("/roles/statistics", protect, authRole("admin"), getRoleStatistics);

// Update user role (admin only)
router.put("/users/:userId/role", protect, authRole("admin"), updateUserRole);

// Approve/reject user (admin only)
router.put("/users/:userId/approve", protect, authRole("admin"), approveUser);

// Toggle user active status (admin only)
router.put("/users/:userId/status", protect, authRole("admin"), toggleUserStatus);

export default router;
