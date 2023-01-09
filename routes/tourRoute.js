const express = require("express");
const {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  aliasToTours,
  getTourStats,
  getMonthlyPlan,
} = require("./../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:tourId/reviews", reviewRoute);

router.route("/top-5-cheap").get(aliasToTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createATour);
router
  .route("/:id")
  .get(getATour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteATour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateATour);

module.exports = router;
