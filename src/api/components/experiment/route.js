const { Router } = require("express");
const AccessService = require("../../../services/access");
const AuthService = require("../../../services/auth");
const ExperimentController = require("./controller");

const router = new Router();

router
  .route("/new")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    ExperimentController.createExperiment
  );

router
  .route("/delete")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    ExperimentController.deleteExperiment
  );

router
  .route("/get")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    ExperimentController.readExperiment
  );

router
  .route("/card/get")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    ExperimentController.readExperimentCards
  );

router
  .route("/update")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    ExperimentController.updateExperiment
  );

module.exports = router;
