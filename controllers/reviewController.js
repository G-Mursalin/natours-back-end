const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// Handlers
const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).send({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

const setTourUserIDs = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createAReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).send({
    status: "Review Created Successfully",
    data: { review: newReview },
  });
});

const deleteAReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }
  res.status(204).send({ status: "successfully deleted", data: null });
});

const updateAReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }
  res.status(200).send({ status: "successfully updated", data: { review } });
});

module.exports = {
  getAllReviews,
  createAReview,
  deleteAReview,
  updateAReview,
  setTourUserIDs,
};
