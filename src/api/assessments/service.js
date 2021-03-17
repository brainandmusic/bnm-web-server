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
  static deleteAssessmentByTransId(transId) {
    const filter = { transactionId: transId };
    return Assessment.deleteMany(filter);
  }
}

module.exports = AssessmentService;
