// The model represents the database model for its component. In my case it’s a TypeORM class. Mostly it’s used by the service class.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

// Any field not defined here will not be added to the document even if specified in update function
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailVerifyToken: {
    type: String,
    required: true,
    default: uuidv4().replace(/-/g, ""),
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dob: {
    type: String,
  },
  roles: {
    type: Array,
    required: true,
    default: ["participant"],
  },
});

userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

// return true iff password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
