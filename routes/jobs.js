const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJob,
} = require("../controllers/jobsController.js");

router.route("/jobs").get(getJobs);
router.route("/job/new").post(newJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id").put(updateJob);

module.exports = router;
