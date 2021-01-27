const Experiment = require("./model");
const mongoose = require("mongoose");

function createExperiment(exp) {
  const newExp = new Experiment(exp);
  return newExp.save({ w: "majority" });
}

function deleteExperimentById(id) {
  const conditions = { _id: id };
  return Experiment.deleteOne(conditions);
}

function readExperimentById(id) {
  const conditions = { _id: id };
  return Experiment.findOne(conditions);
}

function readExperimentCards(
  filter = {},
  projection = { data: 0 },
  options = {}
) {
  return Experiment.find(filter, projection, options);
}

function updateExperimentById(id, updateDoc) {
  return Experiment.findOneAndUpdate(
    { _id: id },
    { $set: updateDoc },
    {
      upsert: true,
      returnNewDocument: true,
    }
  );
}

module.exports = {
  createExperiment,
  deleteExperimentById,
  readExperimentById,
  readExperimentCards,
  updateExperimentById,
};
