const ExperimentService = require("./service");
const mongoose = require("mongoose");

class ExperimentController {
  static async createExperiment(req, res) {
    try {
      const expInfo = req.body.expInfo;
      if (
        !expInfo ||
        !expInfo.name ||
        !expInfo.creator ||
        !expInfo.data ||
        !expInfo.platform
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment info is incomplete.",
        });
      }
      const expFromDb = await ExperimentService.createExperiment(expInfo);
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

  static async getExperiment(req, res) {
    try {
      const expId = req.params.expId;
      const summary = req.query.summary;
      let projection =
        req.body.projection || (summary === "1" ? { data: 0 } : {});
      const filter = { _id: expId };
      const expsFromDb = await ExperimentService.getExperiments(
        filter,
        projection
      );
      if (expsFromDb.length !== 1) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No experiment is found",
        });
      }
      return res.json({
        status: "OK",
        result: expsFromDb[0],
        message: "Experiment has been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getExperiments(req, res) {
    try {
      const expIds = req.body.expIds;
      const projection = req.body.projection;
      let filter = {};
      if (expIds) {
        filter = { _id: { $in: expIds } };
      }
      const expsFromDb = await ExperimentService.getExperiments(
        filter,
        projection
      );
      return res.json({
        status: "OK",
        result: expsFromDb,
        message: "Experiments have been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async updateExperiment(req, res) {
    try {
      const expId = req.params.expId;
      const updatedFields = req.body.updatedFields;
      if (!expId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment ID is missing.",
        });
      }
      const resultFromDb = await ExperimentService.updateExperiments(
        [expId],
        updatedFields
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Experiment has been updated successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteExperiment(req, res) {
    try {
      const expId = req.params.expId;
      if (!expId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment ID is missing.",
        });
      }
      const resultFromDb = await ExperimentService.deleteExperiments([expId]);
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Experiment has been delete successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = ExperimentController;
