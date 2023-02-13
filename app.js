const express = require("express");
const app = express();

const dotenv = require("dotenv");

const connectDatabase = require("./config/database.js");

//setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//connecting to database
connectDatabase();

// Setup body parser
app.use(express.json());

//Importing all routes
const jobs = require("./routes/jobs.js");

app.use("/api/v1", jobs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is started at PORT ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
