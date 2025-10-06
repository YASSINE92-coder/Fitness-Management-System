import express from "express";
import { 
  getAllPrograms, 
 updateProgramStatus,
  deleteProgram 
} from "../controllers/adminProgramController.js";

import { authenticate, isAllowed } from "../middleware/Auth.js";

const router = express.Router();


router.use(authenticate, isAllowed);

router.get("/", getAllPrograms);              
router.put("/:id/status", updateProgramStatus)
router.delete("/:id", deleteProgram);        
export default router;
