const express = require("express");
const {
  getAllUsers,
  updateMe,
  deleteMe,
  getAUser,
  deleteAUser,
  updateAUser,
  getMe,
} = require("./../controllers/userController");
const {
  signUp,
  logIn,
  protect,
  forgetPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require("./../controllers/authController");

// Routs
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

router.get("/me", protect, getMe, getAUser);

router.post("/forgot-password", forgetPassword);
router.patch("/reset-password/:token", resetPassword);

router.patch("/update-my-password", protect, updatePassword);

router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);
router
  .route("/:id")
  .get(protect, restrictTo("admin"), getAUser)
  .delete(protect, restrictTo("admin"), deleteAUser)
  .patch(protect, restrictTo("admin"), updateAUser);

module.exports = router;
