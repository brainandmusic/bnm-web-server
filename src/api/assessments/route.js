const { Router } = require("express");
const AssessmentController = require("./controller");

const router = new Router();

router.route("/").post(AssessmentController.createAssessment);
router.route("/:assId").get(AssessmentController.getAssessment);
router.route("/:assId").delete(AssessmentController.deleteAssessment);
router.route("/:assId/answer").post(AssessmentController.createAnswer);
router.route("/:assId/status/:status").post(AssessmentController.updateStatus);
module.exports = router;
