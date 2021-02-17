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
  members: [mongoose.Types.ObjectId],
  arms: [
    {
      name: {
        type: String,
        required: true,
      },
      events: [
        {
          name: {
            type: String,
            required: true,
          },
          experiments: [mongoose.Types.ObjectId],
        },
      ],
    },
  ],
});

const Study = mongoose.model("Study", studySchema, "studies");

module.exports = Study;
