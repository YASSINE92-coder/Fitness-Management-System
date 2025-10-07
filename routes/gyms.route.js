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

router.get('/gyms', getAllGyms);          // inclut les filtres !
router.get('/gyms/:id', getGymById);

router.post('/gyms', createGym);
router.patch('/gyms/:id', updateGym);
router.delete('/gyms/:id', deleteGym);
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