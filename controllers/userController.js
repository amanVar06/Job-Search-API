const User = require("../models/users.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");

// Get Current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    //What I want to populate?
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

//Delete current User => /api/v1/me/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
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
