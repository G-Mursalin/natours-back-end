const express = require("express");
const {
  getAllUsers,
  postAUser,
  getAUser,
  deleteAUser,
  updateAUser,
} = require("./../controllers/userController");
const { signUp, logIn } = require("./../controllers/authController");

// Routs
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

router.route("/").get(getAllUsers).post(postAUser);
router.route("/:id").get(getAUser).delete(deleteAUser).patch(updateAUser);

module.exports = router;
