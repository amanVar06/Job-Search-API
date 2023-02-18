const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassoword,
  resetPassword,
  logout,
} = require("../controllers/authController.js");

const { isAuthenticatedUser } = require("../middlewares/auth.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassoword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(isAuthenticatedUser, logout);

module.exports = router;
