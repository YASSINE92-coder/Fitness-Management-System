import express from "express"; 
import programPaymentController from "../controllers/payments.controller.js";
import paymentsController from "../controllers/payments.controller.js";

const paymentRouter = express.Router();

paymentRouter.get("/programs/:id/checkout", paymentsController.checkoutProgram);
paymentRouter.get("/programs/:id/buy", paymentsController.buyProgram);

export default paymentRouter;
