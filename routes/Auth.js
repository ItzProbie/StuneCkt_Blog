const express = require("express");
const router = express.Router();

const { sendOtp, signUp, login } = require("../controllers/Auth");

router.post("/send-otp" , sendOtp);
router.post("/signup" , signUp);
router.post("/login" , login);

module.exports = router;