const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
  creationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  participantIds: [mongoose.Types.ObjectId],
  groupIds: [mongoose.Types.ObjectId],
});

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);

module.exports = Transaction;
