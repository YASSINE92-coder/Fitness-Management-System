import express from "express";
import programPaymentController from "../controllers/payments.controller";
import paymentsController from "../controllers/payments.controller";

const paymentRouter = express.Router();

paymentRouter.get("program/:id/checkout", paymentsController.checkoutProgram);
paymentRouter.post("program/:id/buy", paymentsController.buyProgram);

export default paymentRouter;
