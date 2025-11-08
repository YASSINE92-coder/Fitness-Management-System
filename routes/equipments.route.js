// routes/equipment.route.js
import { Router } from 'express';
import { addCustomEquipment } from '../controllers/equipments.controller.js';
import uploadMiddleware from '../utils/multer.js'; // Use your existing multer config

const router = Router();

// Configure upload for custom equipment picture (single file, max 5MB)
const uploadCustomEquipmentPicture = uploadMiddleware.single('picture'); // Expect field name 'picture'

// POST /api/equipment/custom
router.post('/custom', uploadCustomEquipmentPicture, addCustomEquipment);

export default router;