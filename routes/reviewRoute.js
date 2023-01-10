const express = require("express");
const {
  getAllReviews,
  createAReview,
  deleteAReview,
  updateAReview,
  getAReview,
  setTourUserIDs,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUserIDs, createAReview);

router
  .route("/:id")
  .get(getAReview)
  .delete(protect, restrictTo("user", "admin"), deleteAReview)
  .patch(protect, restrictTo("user", "admin"), updateAReview);

module.exports = router;
