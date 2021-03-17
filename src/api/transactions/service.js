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
    // console.log("newTran");
    // console.log(newTran);
    // get experiments associated with this event
    const eventsFromDb = await StudyService.getEvent(studyId, armId, eventId);
    // console.log("eventsFromDb");
    // console.log(eventsFromDb);
    const expFromDb = eventsFromDb[0].experiments;
    // console.log("expFromDb");
    // console.log(expFromDb);
    // get groups
    const groupsFromDb =
      groupIds &&
      (await GroupService.getGroups({
        _id: { $in: groupIds },
      }));
    // console.log("groupsFromDb");
    // console.log(groupsFromDb);
    // assign groups and individuals to experiments
    if (participantIds) {
      // participantIds.forEach(async (pid) => {
      //   await expFromDb.forEach(async (eid) => {
      //     await AssessmentService.createAssessment({
      //       transactionId: newTran._id,
      //       studyId: studyId,
      //       armId: armId,
      //       eventId: eventId,
      //       experimentId: eid,
      //       assignerId: creator,
      //       participantId: pid,
      //     });
      //   });
      // });
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
}

module.exports = TransactionService;
