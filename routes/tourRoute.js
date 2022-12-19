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

const router = express.Router();

router.route("/top-5-cheap").get(aliasToTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getAllTours).post(createATour);
router.route("/:id").get(getATour).delete(deleteATour).patch(updateATour);

module.exports = router;
