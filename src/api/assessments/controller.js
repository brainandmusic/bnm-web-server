const AssessmentService = require("./service");

class AssessmentController {
  static async createAssessment(req, res) {
    try {
      // read study info from request
      const assessmentInfo = req.body.assessmentInfo;
      // validate study info
      if (
        !assessmentInfo ||
        !assessmentInfo.transactionId ||
        !assessmentInfo.studyId ||
        !assessmentInfo.armId ||
        !assessmentInfo.eventId ||
        !assessmentInfo.experimentId ||
        !assessmentInfo.assignerId ||
        !assessmentInfo.participantId
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Assessment info is incomplete.",
        });
      }

      const assessmentFromDb = await AssessmentService.createAssessment(
        assessmentInfo
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: assessmentFromDb,
        message: "Assessment has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getAssessment(req, res) {
    try {
      const assId = req.params.assId;
      if (!assId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Assessment ID is missing.",
        });
      }
      const assFromDb = await AssessmentService.getAssessment({ _id: assId });
      if (!assFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No assessment is found",
        });
      }
      return res.json({
        status: "OK",
        result: assFromDb,
        message: "Assessment has been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getAssessments(req, res) {
    try {
      const uid = req.query.uid;
      const transid = req.query.transid;
      const status = req.query.status;
      if (!uid && !transid) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Invalid request",
        });
      }
      let filter = {
        ...(uid && { participantId: uid }),
        ...(transid && { transactionId: transid }),
      };
      if (status) {
        filter.status = status;
      }
      const assFromDb = await AssessmentService.getAssessments(filter);
      return res.json({
        status: "OK",
        result: assFromDb,
        message: "Assessments have been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteAssessment(req, res) {
    try {
      const assId = req.params.assId;
      if (!assId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Assessment ID is missing.",
        });
      }
      const resultFromDb = await AssessmentService.deleteAssessment(assId);
      if (!resultFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No assessment is found",
        });
      }
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Assessment has been deleted successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async createAnswer(req, res) {
    try {
      const assId = req.params.assId;
      const answerInfo = req.body.answerInfo;
      if (!assId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Assessment ID is missing.",
        });
      }
      if (!answerInfo) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Answer info is missing.",
        });
      }
      const filter = { _id: assId };
      const update = { $set: { answer: answerInfo } };
      const assFromDb = await AssessmentService.updateAssessment(
        filter,
        update
      );
      if (!assFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No assessment is found.",
        });
      }
      return res.json({
        status: "OK",
        result: assFromDb,
        message: "Assessment has been updated successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const assId = req.params.assId;
      const status = req.params.status;
      if (!assId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Assessment ID is missing.",
        });
      }
      if (!status) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Answer info is missing.",
        });
      }
      const filter = { _id: assId };
      const update =
        status === "complete"
          ? { $set: { status, completeDate: Date.now() } }
          : { $set: { status } };
      const assFromDb = await AssessmentService.updateAssessment(
        filter,
        update
      );
      if (!assFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No assessment is found.",
        });
      }
      return res.json({
        status: "OK",
        result: assFromDb,
        message: "Assessment has been updated successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async updateAssessment(req, res) {
    try {
      const assId = req.params.assId;
      const assessmentInfo = req.body.assessmentInfo;
      if (!assessmentInfo) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "assessmentInfo is missing.",
        });
      }
      const filter = { _id: assId };
      const update = { $set: assessmentInfo };
      const assFromDb = await AssessmentService.updateAssessment(
        filter,
        update
      );
      if (!assFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No assessment is found.",
        });
      }
      return res.json({
        status: "OK",
        result: assFromDb,
        message: "Assessment has been updated successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = AssessmentController;
