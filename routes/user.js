const express = require("express");
const router = express.Router();

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.js");
const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteCurrentUser,
  getAppliedJobs,
  getPublishedJobs,
  getUsers,
  deleteUserAdmin,
} = require("../controllers/userController.js");

router.use(isAuthenticatedUser); // because using this in all routes

router.route("/me").get(getUserProfile);
router.route("/jobs/applied").get(authorizeRoles("user"), getAppliedJobs);
router
  .route("/jobs/published")
  .get(authorizeRoles("admin", "employeer"), getPublishedJobs);

router.route("/password/update").put(updatePassword);
router.route("/me/update").put(updateUser);

router.route("/me/delete").delete(deleteCurrentUser);

// Admin only routes
router.route("/users").get(authorizeRoles("admin"), getUsers);

router.route("/user/:id").delete(authorizeRoles("admin"), deleteUserAdmin);

module.exports = router;
