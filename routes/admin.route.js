import express from "express";
import { authenticate, isAllowed } from "../middlewares/Auth.js";
import {
  getAllUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  getStats,
 
} from "../controllers/admin.controller.js";

const router = express.Router();

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
