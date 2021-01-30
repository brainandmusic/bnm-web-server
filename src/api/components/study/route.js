const { Router } = require("express");
const AccessService = require("../../../services/access");
const AuthService = require("../../../services/auth");
const StudyController = require("./controller");

const router = new Router();

router
  .route("/new")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    StudyController.createStudy
  );

router
  .route("/get")
  .post(
    AuthService.checkLogin,
    AccessService.isAdmin,
    StudyController.getStudies
  );

module.exports = router;
