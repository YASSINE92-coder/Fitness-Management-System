import express from "express";
import paymentController from "../controllers/payments.controller.js";

const paymentRouter = express.Router();

paymentRouter.get("/programs/:id/checkout", paymentController.checkoutProgram);
paymentRouter.get("/programs/:id/buy", paymentController.buyProgram);

export default paymentRouter;
