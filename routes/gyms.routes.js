import { Router } from 'express';
import {
  createGym,
  getAllGyms,
  getGymById,
  updateGym,
  deleteGym
} from '../controllers/gyms.controller.js';

const router = Router();

router.get('/', getAllGyms);          // inclut les filtres !
router.get('/:id', getGymById);

router.post('/', createGym);
router.patch('/:id', updateGym);
router.delete('/:id', deleteGym);

// Importe le contrôleur
import { getCoachesOfGym } from '../controllers/coachGym.controller.js';

// Dans le routeur
router.get('/:id/coaches', getCoachesOfGym);

export default router;