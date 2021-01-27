const Experiment = require("./model");

function createExperiment(exp) {
  const newExp = new Experiment(exp);
  return newExp.save({ w: "majority" });
}

function deleteExperimentById(id) {
  const conditions = { _id: id };
  return Experiment.deleteOne(conditions);
}

function readExperimentCards(
  filter = {},
  projection = { data: 0 },
  options = {}
) {
  return Experiment.find(filter, projection, options);
}

module.exports = {
  createExperiment,
  deleteExperimentById,
  readExperimentCards,
};
