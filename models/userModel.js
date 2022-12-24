const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Document Middleware:

// For password hashing
userSchema.pre("save", async function (next) {
  //Only run this function if password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Instance Methods:

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPasswordDb
) {
  return await bcrypt.compare(candidatePassword, userPasswordDb);
};

userSchema.methods.isUserChangedPasswordAfterTokenIssued = function (
  JWTTimestamp
) {
  if (this.passwordChangedAt) {
    const dbPasswordChangedTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < dbPasswordChangedTime;
  }

  return false;
};

// Model
const User = mongoose.model("User", userSchema);

module.exports = User;
