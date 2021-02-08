const StudyService = require("./service");

class StudyController {
  static async createStudy(req, res) {
    try {
      // read study info from request
      const studyInfo = req.body.studyInfo;
      // validate study info
      if (
        !studyInfo ||
        !studyInfo.name ||
        !studyInfo.creator ||
        !studyInfo.status
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study info is incomplete.",
        });
      }

      const studyFromDb = await StudyService.createStudy(studyInfo);
      // send response back to the client
      return res.json({
        status: "OK",
        result: studyFromDb,
        message: "Study has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getStudy(req, res) {
    try {
      const studyId = req.params.studyId;
      const filter = { _id: studyId };
      const projection = req.body.projection;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      const studiesFromDb = await StudyService.getStudies(filter, projection);
      if (studiesFromDb.length !== 1) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "Study does not exist.",
        });
      }
      return res.json({
        status: "OK",
        result: studiesFromDb[0],
        message: "Study has been retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getStudies(req, res) {
    try {
      const studyIds = req.body.studyIds;
      const projection = req.body.projection;
      let filter = {};
      if (studyIds) {
        filter = { _id: { $in: studyIds } };
      }
      const studiesFromDb = await StudyService.getStudies(filter, projection);
      return res.json({
        status: "OK",
        result: studiesFromDb,
        message: "Study has been retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async updateStudy(req, res) {
    try {
      const studyId = req.params.studyId;
      const updatedFields = req.body.updatedFields;
      const resultFromDb = await StudyService.updateStudy(
        studyId,
        updatedFields
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Study has been updated successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteStudy(req, res) {
    try {
      const studyId = req.params.studyId;
      const resultFromDb = await StudyService.deleteStudy(studyId);
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Study has been deleted successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getArm(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!armId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm ID is missing.",
        });
      }
      const filter = { _id: studyId, "arms._id": armId };
      const projection = { _id: 0, "arms.$": 1 };
      const studyFromDb = await StudyService.getStudy(filter, projection);
      if (studyFromDb.arms.length === 0) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No arm with this ID is found.",
        });
      }
      return res.json({
        status: "OK",
        result: studyFromDb.arms[0],
        message: "Arm has been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async createArm(req, res) {
    try {
      const studyId = req.params.studyId;
      // read arm info from request
      const armInfo = req.body.armInfo;
      // validate study info
      if (!armInfo || !armInfo.name) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm info is incomplete.",
        });
      }

      const studyFromDb = await StudyService.createArm(studyId, armInfo);
      // send response back to the client
      return res.json({
        status: "OK",
        result: studyFromDb,
        message: "Arm has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getArms(req, res) {
    try {
      const studyId = req.params.studyId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      const studyFromDb = await StudyService.getArms(studyId);
      if (!studyFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No arm is found.",
        });
      }
      return res.json({
        status: "OK",
        result: studyFromDb.arms,
        message: "Arms have been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteArm(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!armId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm ID is missing.",
        });
      }
      const resultFromDb = await StudyService.deleteArms(studyId, armId);
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Arm has been deleted successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async createEvent(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      // read arm info from request
      const eventInfo = req.body.eventInfo;
      // validate study info
      if (!eventInfo || !eventInfo.name) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Event info is incomplete.",
        });
      }

      const studyFromDb = await StudyService.createEvent(
        studyId,
        armId,
        eventInfo
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: studyFromDb,
        message: "Event has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getEvents(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!armId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm ID is missing.",
        });
      }
      const studyFromDb = await StudyService.getEvents(studyId, armId);
      return res.json({
        status: "OK",
        result: studyFromDb.arms[0].events,
        message: "Events have been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getEvent(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      const eventId = req.params.eventId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!armId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm ID is missing.",
        });
      }
      if (!eventId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Event ID is missing.",
        });
      }
      const eventsFromDb = await StudyService.getEvent(studyId, armId, eventId);
      return res.json({
        status: "OK",
        result: eventsFromDb[0],
        message: "Event has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      const eventId = req.params.eventId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!armId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Arm ID is missing.",
        });
      }
      if (!eventId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Event ID is missing.",
        });
      }
      const resultFromDb = await StudyService.deleteEvent(
        studyId,
        armId,
        eventId
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Event has been deleted successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = StudyController;
