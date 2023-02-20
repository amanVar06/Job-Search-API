const express = require("express");
const router = express.Router();

const { isAuthenticatedUser } = require("../middlewares/auth.js");
const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");

router.route("/me").get(isAuthenticatedUser, getUserProfile);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUser);

router.route("/me/delete").delete(isAuthenticatedUser, deleteUser);

module.exports = router;
