const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

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
  company: {
    type: String,
    required: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    required: true,
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
    required: true,
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
    required: true,
    enum: {
      values: [
        "No Experience",
        "1 year - 2 years",
        "2 year - 5 years",
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
    select: false,
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

module.exports = mongoose.model("Job", jobSchema);
