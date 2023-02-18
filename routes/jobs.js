const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJob,
  deleteJob,
  getJob,
  jobStats,
} = require("../controllers/jobsController.js");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.js");

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

router
  .route("/job/new")
  .post(isAuthenticatedUser, authorizeRoles("employeer", "admin"), newJob);

router
  .route("/job/:id")
  .put(isAuthenticatedUser, authorizeRoles("employeer", "admin"), updateJob)
  .delete(isAuthenticatedUser, authorizeRoles("employeer", "admin"), deleteJob);

module.exports = router;
