import express from "express";
import { authRole } from "../middlewares/authRole.js";
import { protect  } from "../middlewares/Auth.js";

import {
  getAllUsers,
  activateUser,
  deactivateUser,
  deleteUser,
} from "../controllers/admins.controller.js";
import {
  getDashboardStats,
  getRevenueChartData,
  getRoleDistribution,
  getLastTransactions,
  getBestPrograms,
  getRevenueStats,
  getTransactionStats
} from "../controllers/adminStats.controller.js";
import getRecentTransactions from "../controllers/transaction.controller.js"
import { approveCoach, rejectCoach } from "../controllers/coaches.controller.js";
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
router.put("/:id/approve",protect,authRole("admin"), approveCoach)
router.put("/:id/reject",protect,authRole("admin"), rejectCoach                                                                                                                                                                                            );
router.delete("/users/:id", protect, authRole("admin"), deleteUser);
// Route pour les stats du dashboard avec totalRevenue
router.get("/stats", getDashboardStats);
router.get("/revenue-chart", getRevenueChartData);
router.get("/role-distribution", getRoleDistribution);
router.get("/last-transactions", getLastTransactions);
router.get("/best-programs", getBestPrograms);
router.get("/revenue-stats", getRevenueStats);
// Route pour les statistiques des transactions avec données réelles de la DB
router.get('/transaction-stats', getTransactionStats);
router.get('/transactions', getRecentTransactions);

export default router;