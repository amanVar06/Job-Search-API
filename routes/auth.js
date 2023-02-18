const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassoword,
  resetPassword,
} = require("../controllers/authController.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassoword);

router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
