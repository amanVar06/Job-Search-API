const Job = require("../models/jobs.js");

// Get all Jobs => /api/v1/jobs
exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    // middlewareUser: req.user,
    // requestMethod: req.requestMethod,
    // requestURL: req.requestURL,
    message: "This route will display all jobs in future.",
  });
};

//Create a new Job => /api/v1/jobs/new
exports.newJob = async (req, res, next) => {
  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Job Created",
    data: job,
  });
};
