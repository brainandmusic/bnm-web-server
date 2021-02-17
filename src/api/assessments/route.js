const { Router } = require("express");
const AssessmentController = require("./controller");

const router = new Router();

router.route("/").post(AssessmentController.createAssessment);
router.route("/id/:assId").get(AssessmentController.getAssessment);
router.route("/id/:assId").delete(AssessmentController.deleteAssessment);
router.route("/id/:assId/answer").post(AssessmentController.createAnswer);
router
  .route("/id/:assId/status/:status")
  .post(AssessmentController.updateStatus);
module.exports = router;
