const Assessment = require("./model");

class AssessmentService {
  static createAssessment(assessInfo) {
    const newAssessment = new Assessment(assessInfo);
    return newAssessment.save({ w: "majority" });
  }

  static getAssessment(filter = {}, projection = {}, options = {}) {
    return Assessment.findOne(filter, projection, options);
  }

  static updateAssessment(filter = {}, update = {}, options = {}) {
    return Assessment.findOneAndUpdate(filter, update, options);
  }

  static deleteAssessment(assId) {
    const filter = { _id: assId };
    return Assessment.findOneAndDelete(filter);
  }
}

module.exports = AssessmentService;
