const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database is connected with host: ${con.connection.host}.`
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectDatabase;
