import express from 'express';
import * as transactionsController from '../controllers/transactions.controller';
import { protect } from '../middlewares/Auth';
import { authorizeAdmin } from '../middlewares/authRole';

const router = express.Router();

router.get('/stats', protect, authorizeAdmin, transactionsController.getTransactionsStats);

export default router;