const express = require("express");
const {
  getAllUsers,
  updateMe,
  postAUser,
  getAUser,
  deleteAUser,
  updateAUser,
} = require("./../controllers/userController");
const {
  signUp,
  logIn,
  protect,
  forgetPassword,
  resetPassword,
  updatePassword,
} = require("./../controllers/authController");

// Routs
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

router.post("/forgot-password", forgetPassword);
router.patch("/reset-password/:token", resetPassword);

router.patch("/update-my-password", protect, updatePassword);

router.patch("/update-me", protect, updateMe);

router.route("/").get(getAllUsers).post(postAUser);
router.route("/:id").get(getAUser).delete(deleteAUser).patch(updateAUser);

module.exports = router;
