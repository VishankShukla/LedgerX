const express = require("express");
const authControllers = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register",authControllers.userRegisterController);

router.post("/login",authControllers.userLoginController);

router.post("/logout",authControllers.userLogoutController);

module.exports = router;