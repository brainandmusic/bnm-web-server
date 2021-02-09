const mongoose = require("mongoose");
const Study = require("./model");

class StudyService {
  static createStudy(studyInfo) {
    const newStudy = new Study(studyInfo);
    return newStudy.save({ w: "majority" });
  }

  static getStudy(filter, projection = {}) {
    return Study.findOne(filter, projection);
  }

  static getStudies(filter = {}, projection = {}, options = {}) {
    return Study.find(filter, projection, options);
  }

  static updateStudy(studyId, updatedFields) {
    const filter = { _id: studyId };
    const update = { $set: updatedFields };
    return Study.findOneAndUpdate(filter, update);
  }

  static updateStudies(studyIds, updatedFields) {
    const filter = { _id: { $in: studyIds } };
    const update = { $set: updatedFields };
    return Study.updateMany(filter, update, { returnOriginal: false });
  }

  static deleteStudy(studyId) {
    const filter = { _id: studyId };
    return Study.findOneAndDelete(filter);
  }

  static deleteStudies(studyIds) {
    const filter = { _id: { $in: studyIds } };
    return Study.deleteMany(filter);
  }

  static createArm(studyId, armInfo) {
    const filter = { _id: studyId };
    const update = { $push: { arms: armInfo } };
    return Study.findOneAndUpdate(filter, update);
  }

  static getArms(studyId) {
    const filter = { _id: studyId };
    const projection = { _id: 0, arms: 1 };
    return Study.findOne(filter, projection);
  }

  static updateArm(studyId, armId, updatedFields) {
    const filter = { _id: studyId, "arms._id": armId };
    const update = { $set: { "arms.$": updatedFields } };
    return Study.findOneAndUpdate(filter, update);
  }

  static deleteArms(studyId, armIds) {
    const filter = { _id: studyId };
    const update = { $pull: { arms: { _id: { $in: armIds } } } };
    return Study.findOneAndUpdate(filter, update);
  }

  static createEvent(studyId, armId, newEvent) {
    const filter = { _id: studyId, "arms._id": armId };
    const update = { $push: { "arms.$.events": newEvent } };
    return Study.findOneAndUpdate(filter, update);
  }

  static getEvents(studyId, armId) {
    const filter = { _id: studyId, "arms._id": armId };
    const projection = { _id: 0, "arms.$": 1 };
    return Study.findOne(filter, projection);
  }

  static getEvent(studyId, armId, eventId) {
    return Study.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(studyId) } },
      { $unwind: "$arms" },
      { $match: { "arms._id": mongoose.Types.ObjectId(armId) } },
      { $unwind: "$arms.events" },
      { $match: { "arms.events._id": mongoose.Types.ObjectId(eventId) } },
      { $replaceRoot: { newRoot: "$arms.events" } },
    ]);
  }

  static deleteEvent(studyId, armId, eventId) {
    const filter = { _id: studyId, "arms._id": armId };
    const update = { $pull: { "arms.$.events": { _id: eventId } } };
    return Study.findOneAndUpdate(filter, update);
  }

  static addExperiments(studyId, armId, eventId, expIds) {
    const filter = {
      _id: studyId,
      arms: { $elemMatch: { _id: armId, "events._id": eventId } },
    };
    const update = {
      $addToSet: {
        "arms.$[outer].events.$[inner].experiments": { $each: expIds },
      },
    };
    const options = {
      arrayFilters: [{ "outer._id": armId }, { "inner._id": eventId }],
    };
    return Study.findOneAndUpdate(filter, update, options);
  }

  static removeExperiments(studyId, armId, eventId, expIds) {
    const filter = {
      _id: studyId,
      arms: { $elemMatch: { _id: armId, "events._id": eventId } },
    };
    const update = {
      $pull: {
        "arms.$[outer].events.$[inner].experiments": { $in: expIds },
      },
    };
    const options = {
      arrayFilters: [{ "outer._id": armId }, { "inner._id": eventId }],
    };
    return Study.findOneAndUpdate(filter, update, options);
  }
}

module.exports = StudyService;
