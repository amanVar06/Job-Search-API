const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");

// Check if the user is authenticated or not

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;
  // Bearer is the naming convention that developers follow
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401)); //401 Unauthorized
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  // in payload data we have id of the user
  // we now use this in req object as req.user so that we can use it other places as well in code

  next();
});
