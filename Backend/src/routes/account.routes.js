const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/account/
 * - Create a new account
 * - Protected route
 */
router.post("/",authMiddleware.authMiddleware,accountController.accountCreateController);

/**
 * - GET /api/account/get
 * - get all accounts of logged in user
 */
router.get("/get",authMiddleware.authMiddleware,accountController.getUserAccountsController);

/**
 * - GET /api/account/balance/:accountId
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController);

module.exports = router