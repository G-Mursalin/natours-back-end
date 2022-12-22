const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
// Handlers
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).send({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const postAUser = (req, res) => {
  res.status(500).send({ message: "This route is not define yet (postAUser)" });
};
const getAUser = (req, res) => {
  const { id } = req.params;
  res.status(500).send({ message: "This route is not define yet (getAUser)" });
};
const deleteAUser = (req, res) => {
  const { id } = req.params;
  res
    .status(500)
    .send({ message: "This route is not define yet (deleteAUser)" });
};
const updateAUser = (req, res) => {
  const { id } = req.params;
  res
    .status(500)
    .send({ message: "This route is not define yet (updateAUser)" });
};

module.exports = { getAllUsers, postAUser, getAUser, deleteAUser, updateAUser };
