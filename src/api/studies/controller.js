const StudyService = require("./service");

class StudyController {
  static async createStudy(req, res) {
    try {
      // read study info from request
      const studyInfo = req.body.studyInfo;
      // validate study info
      if (!studyInfo || !studyInfo.name || !studyInfo.creator) {
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
      const uid = req.query.uid;
      const studyIds = req.body.studyIds;
      const projection = req.body.projection;
      let filter = {};
      if (studyIds) {
        filter = { _id: { $in: studyIds } };
      }
      if (uid) {
        // query all the studies this user is a creator or a team member of
        filter = { $or: [{ creator: uid }, { members: uid }] };
      }
      const studiesFromDb = await StudyService.getStudies(filter, projection);
      return res.json({
        status: "OK",
        result: studiesFromDb,
        message: "Studies have been retrieved successfully",
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
        message: "Event has been retrieved successfully.",
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

  static async addExperiment(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      const eventId = req.params.eventId;
      const expId = req.params.expId;
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
      if (!expId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment ID is missing.",
        });
      }
      const resultFromDb = await StudyService.addExperiments(
        studyId,
        armId,
        eventId,
        [expId]
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Experiment has been added successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async addExperiments(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      const eventId = req.params.eventId;
      const expIds = req.body.expIds;
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
      if (!expIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment IDs are missing.",
        });
      }
      const resultFromDb = await StudyService.addExperiments(
        studyId,
        armId,
        eventId,
        expIds
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Experiments have been added to the event successfully.",
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
        result: eventsFromDb[0].experiments,
        message: "Experiments have been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async removeExperiments(req, res) {
    try {
      const studyId = req.params.studyId;
      const armId = req.params.armId;
      const eventId = req.params.eventId;
      const expIds = req.body.expIds;
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
      if (!expIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Experiment IDs are missing.",
        });
      }
      const resultFromDb = await StudyService.removeExperiments(
        studyId,
        armId,
        eventId,
        expIds
      );
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Experiments have been removed from the event successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getMembers(req, res) {
    try {
      const studyId = req.params.studyId;
      const filter = { _id: studyId };
      const projection = { _id: 0, members: 1 };
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      const studyFromDb = await StudyService.getStudy(filter, projection);
      if (studyFromDb === null) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "Study does not exist.",
        });
      }
      return res.json({
        status: "OK",
        result: studyFromDb.members,
        message: "Members have been retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteMember(req, res) {
    try {
      const studyId = req.params.studyId;
      const memberId = req.params.memberId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!memberId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Member ID is missing.",
        });
      }
      const resFromDB = await StudyService.deleteMembers(studyId, [memberId]);

      // const studyFromDb = await StudyService.getStudy(filter, projection);
      // if (studyFromDb === null) {
      //   return res.json({
      //     status: "ZERO_RESULTS",
      //     message: "Study does not exist.",
      //   });
      // }
      return res.json({
        status: "OK",
        result: resFromDB,
        message: "Member has been removed successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async addMembers(req, res) {
    try {
      const studyId = req.params.studyId;
      // read new member IDs from request
      const memberIds = req.body.memberIds;
      // validate member IDs
      if (!memberIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "memberIds is not in request",
        });
      }

      const studyFromDb = await StudyService.addMembers(studyId, memberIds);
      // send response back to the client
      return res.json({
        status: "OK",
        result: studyFromDb,
        message: "Members have been added to study successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getParticipants(req, res) {
    try {
      const studyId = req.params.studyId;
      const filter = { _id: studyId };
      const projection = { _id: 0, participants: 1 };
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      const studyFromDb = await StudyService.getStudy(filter, projection);
      if (studyFromDb === null) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "Study does not exist.",
        });
      }
      return res.json({
        status: "OK",
        result: studyFromDb.participants,
        message: "Participants have been retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteParticipant(req, res) {
    try {
      const studyId = req.params.studyId;
      const participantId = req.params.participantId;
      if (!studyId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Study ID is missing.",
        });
      }
      if (!participantId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Participant ID is missing.",
        });
      }

      const resFromDB = await StudyService.deleteParticipants(studyId, [
        participantId,
      ]);
      return res.json({
        status: "OK",
        result: resFromDB,
        message: "Participant has been removed successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async addParticipants(req, res) {
    try {
      const studyId = req.params.studyId;
      // read new participant IDs from request
      const participantIds = req.body.participantIds;
      // validate member IDs
      if (!participantIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "participantIds field is not in request",
        });
      }

      const studyFromDb = await StudyService.addParticipants(
        studyId,
        participantIds
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: studyFromDb,
        message: "Participants have been added to study successfully.",
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
