const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassoword,
} = require("../controllers/authController.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassoword);

module.exports = router;
