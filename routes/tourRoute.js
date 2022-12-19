const express = require("express");
const {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  aliasToTours,
} = require("./../controllers/tourController");

const router = express.Router();

router.route("/top-5-cheap").get(aliasToTours, getAllTours);
router.route("/").get(getAllTours).post(createATour);
router.route("/:id").get(getATour).delete(deleteATour).patch(updateATour);

module.exports = router;
