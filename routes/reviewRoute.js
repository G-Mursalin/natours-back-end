const express = require("express");
const {
  getAllReviews,
  createAReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllReviews).post(createAReview);

module.exports = router;
