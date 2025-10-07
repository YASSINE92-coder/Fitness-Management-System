// routes/athleteConsultation.routes.js
import { Router } from 'express';
import {
  getGymsForAthlete,
  getCoachesForAthlete
} from '../controllers/athleteConsultation.controller.js';

const router = Router();

router.get('/:id/gyms', getGymsForAthlete);
router.get('/:id/coaches', getCoachesForAthlete);

export default router;