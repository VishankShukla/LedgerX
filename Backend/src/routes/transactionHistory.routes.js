const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const transactionHistoryController = require("../controllers/transactionHistory.controller");


router.get("/:accountId",authMiddleware.authMiddleware,transactionHistoryController.getAccountTransactionHistory);

module.exports = router;