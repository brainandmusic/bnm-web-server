const Transaction = require("./model");
const AssessmentService = require("../assessments/service");
const GroupService = require("../groups/service");
const StudyService = require("../studies/service");

class TransactionService {
  static async createTransaction(tranInfo) {
    const {
      studyId,
      armId,
      eventId,
      creator,
      participantIds,
      groupIds,
    } = tranInfo;

    const newTran = new Transaction(tranInfo);
    // get experiments associated with this event
    const eventsFromDb = await StudyService.getEvent(studyId, armId, eventId);
    const expFromDb = eventsFromDb[0].experiments;
    // get groups
    const groupsFromDb =
      groupIds &&
      (await GroupService.getGroups({
        _id: { $in: groupIds },
      }));
    // assign groups and individuals to experiments
    if (participantIds) {
      participantIds.forEach(async (pid) => {
        await expFromDb.forEach(async (eid) => {
          await AssessmentService.createAssessment({
            transactionId: newTran._id,
            studyId: studyId,
            armId: armId,
            eventId: eventId,
            experimentId: eid,
            assignerId: creator,
            participantId: pid,
          });
        });
      });
    }
    if (groupsFromDb) {
      // assign group members to the experiments in the event
      groupsFromDb.forEach(async (group) => {
        await group.members.forEach(async (pid) => {
          await expFromDb.forEach(async (eid) => {
            await AssessmentService.createAssessment({
              transactionId: newTran._id,
              studyId: studyId,
              armId: armId,
              eventId: eventId,
              experimentId: eid,
              assignerId: creator,
              participantId: pid,
            });
          });
        });
      });
    }
    return newTran.save({ w: "majority" });
  }

  static async revokeTransaction(transactionId) {
    // remove all assessments created by this transaction
    await AssessmentService.deleteAssessmentByTransId(transactionId);
    return Transaction.findOneAndDelete({ _id: transactionId });
  }

  static getTransactions(filter = {}, projection = {}, options = {}) {
    return Transaction.find(filter, projection, options);
  }
}

module.exports = TransactionService;
