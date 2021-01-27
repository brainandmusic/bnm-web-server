const ExperimentService = require("./service");
const mongoose = require("mongoose");

async function createExperiment(req, res) {
  try {
    const exp = {};
    // read experiment info from request
    exp.name = req.body.name;
    exp.description = req.body.description;
    exp.platform = req.body.platform;
    exp.creator = req.body.id;
    exp.data = JSON.parse(req.body.data);
    // validate experiment name
    if (!exp.name) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Experiment name is missing.",
      });
    }
    // validate experiment data
    if (!exp.data) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Experiment data is missing.",
      });
    }
    const expFromDb = await ExperimentService.createExperiment(exp);
    // send response back to the client
    return res.json({
      status: "OK",
      result: expFromDb,
      message: "Experiment has been created successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function deleteExperiment(req, res) {
  try {
    // read experiment id from request
    const experimentId = req.body.experimentId;
    // validate experiment ID
    if (!experimentId) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Experiment ID is missing.",
      });
    }
    const deletionResult = await ExperimentService.deleteExperimentById(
      experimentId
    );
    if (deletionResult.deletedCount === 0) {
      return res.json({
        status: "ZERO_RESULTS",
        result: deletionResult,
        message: "Experiment is not found or has already been deleted.",
      });
    }
    return res.json({
      status: "OK",
      result: deletionResult,
      message: "Experiment has been deleted successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function readExperiment(req, res) {
  try {
    // read experiment Id from request
    const experimentId = req.body.experimentId;
    if (!experimentId) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Experiment ID is missing.",
      });
    }
    const experimentsFromDb = await ExperimentService.readExperimentById(
      experimentId
    );
    return res.json({
      status: "OK",
      result: experimentsFromDb,
      message: "Experiment have been retrieved successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function readExperimentCards(req, res) {
  try {
    const experimentsFromDb = await ExperimentService.readExperimentCards();
    return res.json({
      status: "OK",
      result: experimentsFromDb,
      message: "Experiments have been retrieved successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function updateExperiment(req, res) {
  try {
    // read experiment ID and data from request body
    const _id = req.body.experimentId
      ? mongoose.Types.ObjectId(req.body.experimentId)
      : mongoose.Types.ObjectId();
    // const updateDoc = JSON.parse(req.body.updateDoc);
    const updateDoc = req.body;
    !req.body.experimentId && (updateDoc.creator = req.body.id);
    delete updateDoc.id;

    const updateResult = await ExperimentService.updateExperimentById(
      _id,
      updateDoc
    );
    return res.json({
      status: "OK",
      result: { _id, ...updateDoc },
      message: "Experiments have been saved successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      result: e,
      message: e.message,
    });
  }
}

module.exports = {
  createExperiment,
  deleteExperiment,
  readExperiment,
  readExperimentCards,
  updateExperiment,
};
