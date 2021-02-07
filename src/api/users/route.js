// Here we define our API endpoints for the corresponding component and assign the controller methods to them. Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) or add component specific middleware.
const { Router } = require("express");
const AccessService = require("../../services/access");
const AuthService = require("../../services/auth");
const UserController = require("./controller");

const router = new Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/logout").post(AuthService.checkLogin, UserController.logout);

router.route("/:userId").get(AuthService.checkLogin, UserController.getUser);

router
  .route("/:userId/role")
  .put(AuthService.checkLogin, UserController.setRole);
router
  .route("/:userId/role")
  .get(AuthService.checkLogin, UserController.getRole);

router.route("/").get(AuthService.checkLogin, UserController.getUsers);

// router.route("/verifyEmail").post(UserController.verifyEmail);
// router.route("/sendVerifyEmail").post(UserController.sendVerifyEmail);

// router
//   .route("/delete")
//   .delete(AuthService.checkLogin, UserController.deleteUser);

// password related
// router
//   .route("/sendForgetPasswordEmail")
//   .post(UserController.sendForgetPasswordEmail);
// router
//   .route("/getEmailFromPasswordResetToken")
//   .post(UserController.getEmailFromPasswordResetToken);
// router.route("/resetPassword").post(UserController.resetPassword);

// get multiple users' information
// router
//   .route("/get")
//   .post(
//     AuthService.checkLogin,
//     AccessService.isAdmin,
//     UserController.readUsers
//   );
// update multiple users' information
// router
//   .route("/update")
//   .post(
//     AuthService.checkLogin,
//     AccessService.isAdmin,
//     UserController.updateUsers
//   );
// profile related
// router.route("/profile").post(AuthService.checkLogin, UserController.readUser);
// router.route("/profile").put(AuthService.checkLogin, UserController.updateUser);

// TODO: add as admin, remove admin
// access level related
// router
//   .route("/admin/set")
//   .post(AuthService.checkLogin, AccessService.isAdmin, UserController.setAdmin);
// router
//   .route("/admin/remove")
//   .post(
//     AuthService.checkLogin,
//     AccessService.isAdmin,
//     UserController.removeAdmin
//   );
// router
//   .route("/admin/get")
//   .post(AuthService.checkLogin, UserController.checkAdmin);

module.exports = router;
