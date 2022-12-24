const User = require("./../models/userModel");
const { promisify } = require("util");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

// Helping Functions
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Controllers
const signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  // const { name, email, password, passwordConfirm } = req.body;
  // const newUser = await User.create({ name, email, password, passwordConfirm });
  const newUser = await User.create(req.body);
  newUser.password = undefined;

  const token = createToken(newUser._id);

  res.status(201).send({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = createToken(user.id);

  res.status(200).send({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const freshUser = await User.findById(decodedToken.id);
  if (!freshUser) {
    return next(new AppError("This user does not exist", 401));
  }

  if (freshUser.isUserChangedPasswordAfterTokenIssued(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password. Please login again", 401)
    );
  }

  req.user = freshUser;
  next();
});

module.exports = { signUp, logIn, protect };
