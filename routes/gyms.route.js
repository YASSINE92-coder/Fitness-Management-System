import { Router } from 'express';
import { protect } from "../middlewares/Auth.js";
import { authRole } from "../middlewares/authRole.js";
import {
  createGym,
  getAllGyms,
  getGymById,
  updateGym,
  deleteGym,
   approveGym,     
  rejectGym   
} from '../controllers/gyms.controller.js';
import { getCoachesOfGym } from '../controllers/coachGym.controller.js';
import { getAthletesOfGym } from '../controllers/athleteGym.controller.js';
import uploadMiddleware from '../utils/multer.js';

const router = Router();

router.get('/', getAllGyms);          // inclut les filtres !
router.get('/:id', getGymById);

// const uploadGymPhotos = uploadMiddleware('gyms', 5);
// router.post('/', uploadGymPhotos.array('photos', 10), createGym); // max 10 photos per gym
// router.patch('/:id', uploadGymPhotos.array('photos', 10), updateGym);
router.delete('/:id', deleteGym);
router.get('/:id/coaches', getCoachesOfGym);
router.get('/:id/athletes', getAthletesOfGym);

router.put('/:id/approve', protect, authRole('admin'), approveGym);
router.put('/:id/reject', protect, authRole('admin'), rejectGym);

// ========================= GYM ROUTES =========================
router.get("/gym/events", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} events`, 
    route: "/gym/events",
    permissions: ["²create_events", "update_events", "delete_events", "view_events"]
  });
});

router.get("/gym/members", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} members`, 
    route: "/gym/members",
    permissions: ["view_members"]
  });
});

router.get("/gym/equipment", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} equipment`, 
    route: "/gym/equipment",
    permissions: ["manage_equipment"]
  });
});

export default router;