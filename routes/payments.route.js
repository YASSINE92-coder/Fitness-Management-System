import express from "express";
import paymentController from "../controllers/payments.controller.js";
import { authenticate } from "../middlewares/Auth.js";

const paymentRouter = express.Router();

paymentRouter.get("/programs/:id/user/:uid/buy", paymentController.buyProgram);
paymentRouter.use(authenticate);
paymentRouter.get("/programs/:id/checkout", paymentController.checkoutProgram);

export default paymentRouter;
