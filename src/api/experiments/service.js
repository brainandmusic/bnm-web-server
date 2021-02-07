const Experiment = require("./model");

class ExperimentService {
  static createExperiment(exp) {
    const newExp = new Experiment(exp);
    return newExp.save({ w: "majority" });
  }

  static getExperiments(filter = {}, projection = {}, options = {}) {
    return Experiment.find(filter, projection, options);
  }

  static updateExperiments(expIds, updatedFields) {
    const filter = { _id: { $in: expIds } };
    const update = { $set: updatedFields };
    return Experiment.updateMany(filter, update);
  }

  static deleteExperiments(expIds) {
    const filter = { _id: { $in: expIds } };
    return Experiment.deleteMany(filter);
  }
}

module.exports = ExperimentService;
