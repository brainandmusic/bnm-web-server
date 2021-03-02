const { Router } = require("express");
const AccessService = require("../../services/access");
const AuthService = require("../../services/auth");
const StudyController = require("./controller");

const router = new Router();

router.route("/").post(StudyController.createStudy);
router.route("/").get(StudyController.getStudies);

router.route("/:studyId").get(StudyController.getStudy);
router.route("/:studyId").put(StudyController.updateStudy);
router.route("/:studyId").delete(StudyController.deleteStudy);

router.route("/:studyId/arms").post(StudyController.createArm);
router.route("/:studyId/arms").get(StudyController.getArms);
router.route("/:studyId/arms/:armId").get(StudyController.getArm);
router.route("/:studyId/arms/:armId").delete(StudyController.deleteArm);

router.route("/:studyId/arms/:armId/events").get(StudyController.getEvents);
router.route("/:studyId/arms/:armId/events").post(StudyController.createEvent);
router
  .route("/:studyId/arms/:armId/events/:eventId")
  .get(StudyController.getEvent);
router
  .route("/:studyId/arms/:armId/events/:eventId")
  .delete(StudyController.deleteEvent);

router
  .route("/:studyId/arms/:armId/events/:eventId/experiments")
  .get(StudyController.getExperiments);
router
  .route("/:studyId/arms/:armId/events/:eventId/experiments")
  .post(StudyController.addExperiments);
router
  .route("/:studyId/arms/:armId/events/:eventId/experiments")
  .delete(StudyController.removeExperiments);
router
  .route("/:studyId/arms/:armId/events/:eventId/experiments/:expId")
  .post(StudyController.addExperiment);

router.route("/:studyId/members").get(StudyController.getMembers);
router.route("/:studyId/members").post(StudyController.addMembers);
router
  .route("/:studyId/members/:memberId")
  .delete(StudyController.deleteMember);

router.route("/:studyId/participants").get(StudyController.getParticipants);
router.route("/:studyId/participants").post(StudyController.addParticipants);
router
  .route("/:studyId/participants/:participantId")
  .delete(StudyController.deleteParticipant);

module.exports = router;
