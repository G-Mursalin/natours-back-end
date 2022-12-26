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

const router = express.Router();

router.route("/top-5-cheap").get(aliasToTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createATour);
router
  .route("/:id")
  .get(getATour)
  .delete(protect, restrictTo("admin"), deleteATour)
  .patch(updateATour);

module.exports = router;
