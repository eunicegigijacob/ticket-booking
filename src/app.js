const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const errorHandler = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  })
);


app.use("/api", routes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});



app.use(errorHandler);

module.exports = app;
