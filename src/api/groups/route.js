const { Router } = require("express");
const GroupController = require("./controller");

const router = new Router();

// get a list of all groups
router.route("/").get(GroupController.getGroups);

// create a group
router.route("/").post(GroupController.createGroup);

// delete specified groups
router.route("/").delete(GroupController.deleteGroups);

// get a group
router.route("/:groupId").get(GroupController.getGroup);

// delete a group
router.route("/:groupId").delete(GroupController.deleteGroup);

// add a member to the specified group
router
  .route("/:groupId/members/:memberId")
  .post(GroupController.addMemberToGroup);

// add new members to the specified group
router.route("/:groupId/members").post(GroupController.addMembersToGroup);

// remove a member from the specified group
router
  .route("/:groupId/members/:memberId")
  .delete(GroupController.removeMemberFromGroup);

// remove members from the specified group
router
  .route("/:groupId/members")
  .delete(GroupController.removeMembersFromGroup);

module.exports = router;
