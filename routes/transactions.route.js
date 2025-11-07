const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');
const { protect } = require('../middlewares/Auth');
const { authorizeAdmin } = require('../middlewares/authRole');

router.get('/stats', protect, authorizeAdmin, transactionsController.getTransactionsStats);

module.exports = router;