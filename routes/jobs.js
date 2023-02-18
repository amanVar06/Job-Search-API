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

const { isAuthenticatedUser } = require("../middlewares/auth.js");

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

router.route("/job/new").post(isAuthenticatedUser, newJob);

router
  .route("/job/:id")
  .put(isAuthenticatedUser, updateJob)
  .delete(isAuthenticatedUser, deleteJob);

module.exports = router;
