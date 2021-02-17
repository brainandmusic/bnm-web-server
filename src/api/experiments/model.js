const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const experimentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  platform: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  creator: {
    type: mongoose.ObjectId,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const Experiment = mongoose.model(
  "Experiment",
  experimentSchema,
  "experiments"
);

module.exports = Experiment;
