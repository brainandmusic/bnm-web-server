const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["private", "public"],
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
  members: [
    {
      id: mongoose.Types.ObjectId,
      firstName: String,
      lastName: String,
      email: String,
    },
  ],
  experiments: [
    {
      id: mongoose.Types.ObjectId,
      stage: String,
    },
  ],
});

const Study = mongoose.model("Study", studySchema, "studies");

module.exports = Study;
