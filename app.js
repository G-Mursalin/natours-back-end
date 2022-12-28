const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const tourRoute = require("./routes/tourRoute");
const userRoute = require("./routes/userRoute");
const AppError = require("./utils/appError");
const { globalErrorController } = require("./controllers/errorController");

//Middleware
app.use(express.json({ limit: "10kb" }));
app.use(cors());

//***Security:

//HTTP Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests sent by this IP, please try again in an hour !",
});
app.use("/api", limiter);

//Routs
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't not fine ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
