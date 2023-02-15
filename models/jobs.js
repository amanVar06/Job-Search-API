const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const geoCoder = require("../utils/geocoder.js");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter Job title."],
    trim: true, //need to remove blank spaces
    maxlength: [100, "Job title can not exceed 100 characters."],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter Job description."],
    maxlength: [1000, "Job description can not exceed 1000 characters."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please add a valid email address."],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  location: {
    //we want to generate city, area, zip code using the address user provide
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  company: {
    type: String,
    required: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    required: [true, "Please enter industry for this job"],
    enum: {
      values: [
        "Business",
        "Information Technology",
        "Banking",
        "Education/Training",
        "Telecommunication",
        "Others",
      ],
      message: "Please select correct option for industry.",
    },
  },
  jobType: {
    type: String, //not array of string because need to choose only one option
    required: [true, "Please enter job type"],
    enum: {
      values: ["Permanent", "Temporary", "Internship"],
      message: "Please select correct option for job type.",
    },
  },
  minEducation: {
    type: String, //not array of string because need to choose only one option
    required: [true, "Please enter minimum education for this job."],
    enum: {
      values: ["Bachelors", "Masters", "Phd"],
      message: "Please select correct option for education.",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: [true, "Please enter experience required for this job"],
    enum: {
      values: [
        "No Experience",
        "1 year - 2 years",
        "2 years - 5 years",
        "More than 5 years",
      ],
      message: "Please select correct option for Experience.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Please enter expected salary for this job."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
  applicantsApplied: {
    type: [Object],
    select: false, //to hide this from user
  },
});

//Creating Job slug before saving using mongoose middleware pre
jobSchema.pre("save", function (next) {
  //can not use arrow function here because of this
  //Creating slug before saving to DB
  this.slug = slugify(this.title, { lower: true });

  //I want to make a slug for my title

  //this refers to object itself here
  //this.slug means slug for this job

  next();
});

//Setting up location
jobSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  next();
});

module.exports = mongoose.model("Job", jobSchema);
