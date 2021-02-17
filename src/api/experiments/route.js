const { Router } = require("express");
const AccessService = require("../../services/access");
const AuthService = require("../../services/auth");
const ExperimentController = require("./controller");

const router = new Router();

router.route("/").post(ExperimentController.createExperiment);
router.route("/").get(ExperimentController.getExperiments);

router.route("/:expId").get(ExperimentController.getExperiment);
router.route("/:expId").put(ExperimentController.updateExperiment);
router.route("/:expId").delete(ExperimentController.deleteExperiment);

module.exports = router;
