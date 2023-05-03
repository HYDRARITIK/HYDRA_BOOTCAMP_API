const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const app = express();
const morgan = require("morgan");
const connectDb = require("./config/db");
const file_upload = require("express-fileupload");
const cookie_parser = require("cookie-parser");

//custom middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//connect to database
connectDb();

//body parser
app.use(express.json());

//file upload middleware

app.use(file_upload());

//cookie parser
app.use(cookie_parser());

//set static folder
app.use(express.static(`${__dirname}/public`));

//mounting the router

const bootcamp_routes = require("./routes/bootcampRoute");
const course_routes = require("./routes/courseRoute");
const auth_routes = require("./routes/authRoute");
app.use("/api/v1/bootcamps", bootcamp_routes);
app.use("/api/v1/courses", course_routes);
app.use("/api/v1/auth", auth_routes);

//custom error handler
// app.use(errorHandler);

const Port = process.env.PORT || 5000;

const server = app.listen(
  Port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${Port}`)
);

//handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
