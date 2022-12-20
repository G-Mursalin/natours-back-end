const mongoose = require("mongoose");
const slugify = require("slugify");
// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    createdAt: {
      type: Date,
      default: new Date(),
      select: false,
    },
    startDates: [Date],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Property
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// Document Middleware: This will run before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
