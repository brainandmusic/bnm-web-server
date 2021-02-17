const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Any field not defined here will not be added to the document even if specified in update function
const groupSchema = new Schema({
  name: {
    type: String,
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
  members: [mongoose.Types.ObjectId],
});

const Group = mongoose.model("Group", groupSchema, "groups");

module.exports = Group;
