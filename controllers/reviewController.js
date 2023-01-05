const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// Handlers
const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).send({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

const createAReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).send({
    status: "Review Created Successfully",
    data: { review: newReview },
  });
});

module.exports = { getAllReviews, createAReview };