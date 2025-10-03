// routes/coaches.routes.js
import { Router } from 'express';
import {
  createCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach
} from '../controllers/coaches.controller.js';

const router = Router();

// Routes publiques (à sécuriser plus tard avec auth middleware)
router.post('/', createCoach);
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.patch('/:id', updateCoach);
router.delete('/:id', deleteCoach);

export default router;