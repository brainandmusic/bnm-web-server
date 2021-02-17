// Here we define our API endpoints for the corresponding component and assign the controller methods to them. Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) or add component specific middleware.
const { Router } = require("express");
const AccessService = require("../../services/access");
const AuthService = require("../../services/auth");
const UserController = require("./controller");

const router = new Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/logout").post(AuthService.isLoggedIn, UserController.logout);

router.route("/:userId").get(AuthService.isLoggedIn, UserController.getUser);

// send password reset email to user
router.route("/password/reset").post(UserController.forgetPassword);
router
  .route("/:userId/password/reset/token/:token")
  .post(UserController.resetPassword);

// send verification email to a newly registered user
router.route("/:userId/account/verify").post(UserController.sendVerifyEmail);
router
  .route("/:userId/account/verify/token/:token")
  .post(UserController.verifyEmail);

router
  .route("/:userId/role")
  .put(AuthService.isLoggedIn, UserController.setRole);
router
  .route("/:userId/role")
  .get(AuthService.isLoggedIn, UserController.getRole);

router.route("/").get(AuthService.isLoggedIn, UserController.getUsers);

module.exports = router;
