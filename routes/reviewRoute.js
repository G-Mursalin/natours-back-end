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
  .get(protect, restrictTo("admin"), getAReview)
  .delete(protect, restrictTo("admin"), deleteAReview)
  .patch(protect, restrictTo("admin"), updateAReview);

module.exports = router;
