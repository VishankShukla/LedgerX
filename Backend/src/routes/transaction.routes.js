const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");


const transactionRouter = express.Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRouter.post('/',authMiddleware.authMiddleware,transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - create a initial fund transaction from system user
 */
transactionRouter.post('/system/initial-funds',authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction);


module.exports = transactionRouter;