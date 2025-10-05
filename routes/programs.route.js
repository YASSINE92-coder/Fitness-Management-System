import express from "express";
import createProgramValidator from "../validators/createProgram.validator.js";
import programController from "../controllers/programs.controller.js";
import { authRole } from "../middlewares/authRole.js";

const programRouter = express.Router();

programRouter.use(authRole("coach"));

programRouter.post("/", createProgramValidator, programController.store);

export default programRouter;
