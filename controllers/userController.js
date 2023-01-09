const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// Helping Functions
const filterObj = (obj, ...allowedField) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// Handlers
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select(
    "-passwordChangedAt -passwordResetExpires -passwordResetToken"
  );

  res.status(200).send({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }

  const filterBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  updatedUser.password = undefined;
  updatedUser.passwordChangedAt = undefined;
  updatedUser.passwordResetToken = undefined;

  res.status(200).send({ status: "success", data: { user: updatedUser } });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).send({
    status: "success",
    data: null,
  });
});

const postAUser = (req, res) => {
  res.status(500).send({ message: "This route is not define yet (postAUser)" });
};
const getAUser = (req, res) => {
  const { id } = req.params;
  res.status(500).send({ message: "This route is not define yet (getAUser)" });
};

const deleteAUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).send({ status: "successfully deleted", data: null });
});

// Don't update password with this!
const updateAUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).send({ status: "successfully updated", data: { user } });
});

module.exports = {
  getAllUsers,
  updateMe,
  deleteMe,
  postAUser,
  getAUser,
  deleteAUser,
  updateAUser,
};
