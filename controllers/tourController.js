const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const { catchAsync } = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// Middleware
const aliasToTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summery,difficulty";
  next();
};

// Controllers
const getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .filterLimiting()
    .pagination();
  const tours = await features.query;

  res.status(200).send({
    status: "success",
    results: tours.length,
    data: { tours },
  });
});

const createATour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res
    .status(201)
    .send({ status: "Tour Created Successfully", data: { tour: newTour } });
});

const getATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).send({ status: "success", data: { tour } });
});

const updateATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).send({ status: "successfully updated", data: { tour } });
});

const deleteATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).send({ status: "successfully deleted", data: null });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);

  res.status(200).send({ status: "success", data: { stats } });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStart: -1 },
    },
  ]);

  res
    .status(200)
    .send({ status: "success", results: plan.length, data: { plan } });
});

module.exports = {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  aliasToTours,
  getTourStats,
  getMonthlyPlan,
};
