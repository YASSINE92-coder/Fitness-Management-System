// routes/coaches.routes.js
import { Router } from 'express';
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js";
import {
  createCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach
} from '../controllers/coaches.controller.js';

const router = Router();

// Routes publiques (à sécuriser plus tard avec auth middleware)
router.post('/coaches', createCoach);
router.get('/coaches', getAllCoaches);
router.get('/coaches/:id', getCoachById);
router.patch('/coaches/:id', updateCoach);
router.delete('/coaches/:id', deleteCoach);

// ========================= COACH ROUTES =========================
router.get("/coaches/athletes", protect, authRole("coach"), (req, res) => {
  res.json({ 
    message: `Coach ${req.user.name} athletes`, 
    route: "/coaches/athletes",
    permissions: ["view_athletes", "view_athlete_progress"]
  });
});

router.get("/coaches/programs", protect, authRole("coach"), (req, res) => {
  res.json({ 
    message: `Coach ${req.user.name} programs`, 
    route: "/coach/programs",
    permissions: ["create_programs", "update_own_programs", "delete_own_programs"]
  });
});



export default router;