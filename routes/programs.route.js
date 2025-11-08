import express from "express";
import createProgramValidator from "../validators/program/createProgram.validator.js";
import updateProgramValidator from "../validators/program/updateProgram.validator.js";
import programController from "../controllers/programs.controller.js";
import { authRole } from "../middlewares/authRole.js";
import getProgramValidator from "../validators/program/getProgram.validator.js";
import { authenticate } from "../middlewares/Auth.js";
import upload from "../utils/multer.js";

const programRouter = express.Router();

// List programs - public access
programRouter.get("/", getProgramValidator, programController.index);

// programRouter.use(authenticate);
// Delete program - admin and coach only
programRouter.delete(
  "/:id",
  authRole("admin", "coach"),
  programController.delete
);
// Routes below are for coach only
programRouter.use(authRole("coach"));
programRouter.get("/:id", programController.show);
programRouter.post(
  "/",
  upload.fields([{ name: "file",maxCount:1 }, { name: "image",maxCount:1 }]),
  createProgramValidator,
  programController.store
);
programRouter.put("/:id", updateProgramValidator, programController.update);
programRouter.patch("/:id", updateProgramValidator, programController.update);

export default programRouter;
