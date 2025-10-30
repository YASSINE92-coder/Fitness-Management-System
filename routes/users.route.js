import express from "express";
import { protect } from "../middlewares/Auth.js";
import { authRole } from "../middlewares/authRole.js";
import { authorizeSelfOrRoles } from "../middlewares/authorize.js";
import { createUser, getUserById, updateUserById, deleteUserById } from "../controllers/users.controller.js";
import { body } from "express-validator";
import { handleValidation } from "../middlewares/validation.js";

const router = express.Router();

// Reuse existing validation building blocks
const createRules = [
  body("name").exists({ checkFalsy: true }).isLength({ min: 2, max: 80 }),
  body("email").exists({ checkFalsy: true }).isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  body("gender").exists({ checkFalsy: true }).isIn(["male", "female"]),
  handleValidation,
];

const updateRules = [
  body("name").optional().isLength({ min: 2, max: 80 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("password").optional().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  body("gender").optional().isIn(["male", "female"]),
  handleValidation,
];

// POST /users - registration (public)
router.post("/users", createRules, createUser);

// GET /users/:id - owner or admin/coach/gym can read
router.get("/users/:id", protect, authorizeSelfOrRoles("admin", "coach", "gym"), getUserById);

// PUT /users/:id - owner can update; admin can also update
router.put("/users/:id", protect, authorizeSelfOrRoles("admin"), updateRules, updateUserById);

// DELETE /users/:id - admin only
router.delete("/users/:id", protect, authRole("admin"), deleteUserById);

export default router;



