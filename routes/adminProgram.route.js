import express from "express";
import { 
  getAllPrograms, 
 updateProgramStatus,

} from "../controllers/adminProgram.controller.js";

import { authenticate, isAllowed } from "../middlewares/Auth.js";

const router = express.Router();


router.use(authenticate, isAllowed);

router.get("/", getAllPrograms);              
router.put("/:id/status", updateProgramStatus)
export default router;
