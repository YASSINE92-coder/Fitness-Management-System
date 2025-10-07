import { Router } from 'express';
import { protect } from "../middlewares/auth.js";
import { authRole } from "../middlewares/authRole.js";
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
// ========================= GYM ROUTES =========================
router.get("/events", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} events`, 
    route: "/events",
    permissions: ["²create_events", "update_events", "delete_events", "view_events"]
  });
});

router.get("/members", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} members`, 
    route: "/gym/members",
    permissions: ["view_members"]
  });
});

router.get("/equipment", protect, authRole("gym"), (req, res) => {
  res.json({ 
    message: `Gym ${req.user.name} equipment`, 
    route: "/equipment",
    permissions: ["manage_equipment"]
  });
});

export default router;