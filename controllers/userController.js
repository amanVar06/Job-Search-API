const User = require("../models/users.js");
const Job = require("../models/jobs.js");

const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const APIFilters = require("../utils/apiFilters.js");
const fs = require("fs");

// Get Current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    //What I want to populate? or explore
    path: "jobsPublished", //name of the field
    select: "title postingDate", // only want to see these fields
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Update current user password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password"); //becuase we need to compare with old password as well

  // Check previous password
  const isMathched = await user.comparePasswords(req.body.currentPassword);

  if (!isMathched) {
    return next(new ErrorHandler("Old Password is incorrect.", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update current user data => /api/v1/me/update
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    //you can not update user role and password in this route
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Show all applied jobs => /api/v1/jobs/applied
exports.getAppliedJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ "applicantsApplied.id": req.user.id }).select(
    "+applicantsApplied"
  );

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});

// Show all jobs published by the employeer => /api/v1/jobs/published
exports.getPublishedJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});

//Delete current User => /api/v1/me/delete
exports.deleteCurrentUser = catchAsyncErrors(async (req, res, next) => {
  await deleteUserData(req.user.id, req.user.role);

  const user = await User.findByIdAndDelete(req.user.id);

  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Your account has been deleted",
  });
});

// Adding controller methods that only accessible by admins

// Show all users(Admin) => /api/v1/users
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFilters(User.find(), req.query);
  apiFilters.filter();
  apiFilters.sort();
  apiFilters.limitFields();
  apiFilters.pagination();

  const users = await apiFilters.query;

  res.status(200).json({
    success: true,
    results: users.length,
    data: users,
  });
});

// Delete a user(Admin) => /api/v1/user/:id
exports.deleteUserAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  await deleteUserData(user.id, user.role);
  user.remove();

  res.status(200).json({
    success: true,
    message: "User is successfully deleted by Admin",
  });
});

// Delete user files and employeer jobs
async function deleteUserData(user, role) {
  if (role === "employeer") {
    await Job.deleteMany({ user: user });
    // we already know employeer only publish the job not apply for the job, so no associated files with it
  }

  if (role === "user") {
    const appliedJobs = await Job.find({ "applicantsApplied.id": user }).select(
      "+applicantsApplied"
    );

    for (let i = 0; i < appliedJobs.length; i++) {
      let obj = appliedJobs[i].applicantsApplied.find((o) => o.id === user);

      // console.log(obj, __dirname);

      let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace(
        "/controllers",
        ""
      ); //becuase need to go to parent directory of current directory

      // deleting the file associated with the user

      fs.unlink(filepath, (err) => {
        if (err) return console.log(err);
      });

      // after that we also want to delete the reference of that user
      appliedJobs[i].applicantsApplied.splice(
        appliedJobs[i].applicantsApplied.indexOf(obj.id)
      );

      appliedJobs[i].save();
    }
  }
}
