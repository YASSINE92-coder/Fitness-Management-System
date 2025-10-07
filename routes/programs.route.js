import express from "express";
import createProgramValidator from "../validators/program/createProgram.validator.js";
import updateProgramValidator from "../validators/program/updateProgram.validator.js";
import programController from "../controllers/programs.controller.js";
import { authRole } from "../middlewares/authRole.js";
import getProgramValidator from "../validators/program/getProgram.validator.js";
import { authenticate } from "../middlewares/auth.js";
const programRouter = express.Router();

programRouter.get("/", getProgramValidator, programController.index);

programRouter.use(authenticate);
programRouter.delete(
  "/:id",
  authRole("admin", "coach"),
  programController.delete
);
// Coach middleware
programRouter.use(authRole("coach"));
programRouter.post("/", createProgramValidator, programController.store);
programRouter.put("/:id", updateProgramValidator, programController.update);
programRouter.patch("/:id", updateProgramValidator, programController.update);

export default programRouter;
