const User = require("./../models/userModel");
const crypto = require("crypto");
const { promisify } = require("util");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

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

  const token = createToken(user._id);

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

const restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit your new password and confirmPassword to: ${resetURL}\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).send({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = createToken(user._id);

  res.status(200).send({
    status: "Successfully Changed Password",
    token,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (
    !(await user.isPasswordCorrect(req.body.currentPassword, user.password))
  ) {
    return next(new AppError("Your password is wrong", 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  const token = createToken(user._id);

  res.status(200).send({
    status: "Successfully Updated Password",
    token,
  });
});

module.exports = {
  signUp,
  logIn,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
  updatePassword,
};
