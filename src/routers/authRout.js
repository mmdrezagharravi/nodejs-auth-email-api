const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify", authController.verifyCode);
router.post("/resend-code", authController.resendCode);

module.exports = router;
