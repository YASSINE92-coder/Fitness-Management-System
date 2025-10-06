// routes/coaches.routes.js
import { Router } from 'express';
import {
  createCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach
} from '../controllers/coaches.controller.js';

// Importe aussi les contrôleurs d'association
import {
  attachCoachToGym,
  detachCoachFromGym,
  getCoachesOfGym
} from '../controllers/coachGym.controller.js';
const router = Router();

// Routes publiques (à sécuriser plus tard avec auth middleware)
router.post('/', createCoach);
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.patch('/:id', updateCoach);
router.delete('/:id', deleteCoach);

// Routes d'association (doivent être avant :id générique)
router.patch('/:id/gym', attachCoachToGym);
router.patch('/:id/gym/remove', detachCoachFromGym);

export default router;