import express from "express";
import { authRole } from "../middlewares/authRole.js";
import { protect } from "../middlewares/auth.js"; // Utilisez seulement protect

import {
  getAllUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  getStats,
} from "../controllers/admins.controller.js";
import {
  getDashboardStats,
  getRevenueChartData,
  getRoleDistribution,
  getLastTransactions,
  getBestPrograms,
  getRevenueStats
} from "../controllers/adminStats.controller.js";
import getRecentTransactions from "../controllers/transaction.controller.js"
const router = express.Router();

// ========================= ADMIN ROUTES =========================
router.get("/dashboard", protect, authRole("admin"), (req, res) => {
  res.json({ 
    message: `Welcome admin ${req.user.name}`,
    route: "/admin/dashboard",
    permissions: ["All permissions"]
  });
});

// Utilisez protect + authRole au lieu de authenticate + isAllowed
router.get("/users", protect, authRole("admin"), getAllUsers);
router.patch("/users/:id/activate", protect, authRole("admin"), activateUser);
router.patch("/users/:id/deactivate", protect, authRole("admin"), deactivateUser);
router.delete("/users/:id", protect, authRole("admin"), deleteUser);
router.get("/stats", protect, authRole("admin"), getStats);
router.get("/stats", getDashboardStats);
router.get("/revenue-chart", getRevenueChartData);
router.get("/role-distribution", getRoleDistribution);
router.get("/last-transactions", getLastTransactions);
router.get("/best-programs", getBestPrograms);
router.get("/revenue-stats", getRevenueStats);
router.get('/transactions',protect, authRole("admin"),getRecentTransactions);

export default router;