const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
  studyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  armId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  eventId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  experimentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  assignDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  completeDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "complete"],
    required: true,
    default: "pending",
  },
  assignerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  participantId: {
    type: mongoose.ObjectId,
    required: true,
  },
  answer: {
    type: Object,
  },
});

const Assessment = mongoose.model(
  "Assessment",
  assessmentSchema,
  "assessments"
);

module.exports = Assessment;
