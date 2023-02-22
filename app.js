const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp"); // Express middleware to protect against HTTP Parameter Pollution attacks

const connectDatabase = require("./config/database.js");
const errorMiddleware = require("./middlewares/errors.js");
const ErrorHandler = require("./utils/errorHandler.js");

//setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Handling Uncaught Exception (must write at top)
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to Uncaught Exception.");

  process.exit(1);
  //simply close the process no need to close the server
});

//connecting to database
connectDatabase();

// Set up security headers
app.use(helmet());

// Setup body parser
app.use(express.json());

// Set Cookie parser
app.use(cookieParser());

// Handle file uploads
app.use(fileUpload());

// To remove data using these defaults (i.e. Sanitize data)
// sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xssClean());
//will make the script useless

// Prevent parameter pollution
// The whitelist option allows to specify parameters that shall not be touched by HPP.
app.use(
  hpp({
    whitelist: [`positions`], // that we want to ignore/exclude
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // last two options were in docs
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

//Importing all routes
const jobs = require("./routes/jobs.js");
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);
app.use("/api/v1", user);

// Handling Unhandled Routes (write after all the routes)
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `Server is started at PORT ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//Handling Unhandled Promise Rejection
//Critical Error always close the server after this error occurs
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled promise rejection.");

  server.close(() => {
    process.exit(1);
  });
});
