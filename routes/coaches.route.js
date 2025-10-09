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
import { attachCoachToGym, detachCoachFromGym } from '../controllers/coachGym.controller.js';
const router = Router();

// Routes publiques (à sécuriser plus tard avec auth middleware)

router.post('/', createCoach);
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.patch('/:id', updateCoach);
router.delete('/:id', deleteCoach);
router.patch('/:id/gym', attachCoachToGym);
router.patch('/:id/gym/remove', detachCoachFromGym);

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



export default router;