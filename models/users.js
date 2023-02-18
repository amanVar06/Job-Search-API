const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "employeer"],
      message: "Please select correct role",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter password for your account"],
    minlength: [8, "Your password must be at lease 8 characters long"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//we will use the mongoose middleware pre to encrypt the password
//because we dont want to store the passoword as it is

// Encrypting passwords before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // 10 recommended to use for encrypting
});

// Return JSON web token (this is verify user in future)
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  }); //PAYLOAD STRING as user id
};

// Compare user password with database password
userSchema.methods.comparePasswords = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

//Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // console.log("Reset token Generated", resetToken);

  //Hash and set to reset Password Token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set token expire time (30 min)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
  // we have only saved the hashed version in the database
  // we have to send email to reset password using the reset token
  // not with hashed version, we do not need to send hash version in the email
};

module.exports = mongoose.model("User", userSchema);
