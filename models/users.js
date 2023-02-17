const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  this.password = await bcrypt.hash(this.password, 10); // 10 recommended to use for encrypting
});

module.exports = mongoose.model("User", userSchema);
