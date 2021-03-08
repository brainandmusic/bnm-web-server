const GroupService = require("./service");

class GroupController {
  static async createGroup(req, res) {
    try {
      const groupInfo = req.body.groupInfo;
      if (!groupInfo) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group info is missing",
        });
      }
      const groupFromDb = await GroupService.createGroup(groupInfo);
      return res.json({
        status: "OK",
        result: groupFromDb,
        message: "Group has been created successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteGroup(req, res) {
    try {
      const groupId = req.params.groupId;
      // validate groupId
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      // delete group
      const resultFromDb = await GroupService.deleteGroups([groupId]);
      if (!resultFromDb) {
        return res.json({
          status: "NO_RESULTS",
          message: `No group associated with id ${groupId} is found.`,
        });
      }
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Group has been deleted successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async deleteGroups(req, res) {
    try {
      const groupIds = req.body.groupIds;
      // validate groupIds
      if (!groupIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group IDs are missing",
        });
      }
      // delete groups
      const resultFromDb = await GroupService.deleteGroups(groupIds);
      if (!resultFromDb) {
        return res.json({
          status: "NO_RESULTS",
          message: `No group is found.`,
        });
      }
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Groups have been deleted successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getGroup(req, res) {
    try {
      // read params from request body
      const groupId = req.params.groupId;
      const projection = req.body.projection || {};
      const options = req.body.options || {};
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      // query db
      const groupsFromDb = await GroupService.getGroups(
        { _id: groupId },
        projection,
        options
      );
      if (groupsFromDb.length < 1) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No group is found.",
        });
      }
      // return results to client
      return res.json({
        status: "OK",
        result: groupsFromDb[0],
        message: "Group has been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getGroups(req, res) {
    try {
      const studyId = req.query.studyId;
      const filter = studyId ? { studyId } : {};
      // query db
      const groupsFromDb = await GroupService.getGroups(filter, {}, {});
      // return results to client
      res.json({
        status: "OK",
        result: groupsFromDb,
        message: "Groups have been retrieved successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async addMemberToGroup(req, res) {
    try {
      const groupId = req.params.groupId;
      // validate groupId
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      const memberId = req.params.memberId;
      // validate memberId
      if (!memberId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Member ID is missing",
        });
      }
      // add a new member to group
      const resultFromDb = await GroupService.addMembersToGroup(groupId, [
        memberId,
      ]);
      if (!resultFromDb) {
        return res.json({
          status: "NO_RESULTS",
          message: `No group associated with id ${groupId} is found.`,
        });
      }
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "User has been added to group successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async addMembersToGroup(req, res) {
    try {
      const groupId = req.params.groupId;
      // validate groupId
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      // validate memberIds
      const memberIds = req.body.memberIds;
      if (!memberIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Member IDs are missing",
        });
      }
      // add new members to group
      const resultFromDb = await GroupService.addMembersToGroup(
        groupId,
        memberIds
      );
      // return updated doc to client
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Users has been added to group successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async removeMemberFromGroup(req, res) {
    try {
      const groupId = req.params.groupId;
      // validate groupId
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      const memberId = req.params.memberId;
      // validate memberId
      if (!memberId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Member ID is missing",
        });
      }
      // remove a member from group
      const resultFromDb = await GroupService.removeMembersFromGroup(groupId, [
        memberId,
      ]);
      if (!resultFromDb) {
        return res.json({
          status: "NO_RESULTS",
          message: `No group associated with id ${groupId} is found.`,
        });
      }
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "User has been removed from the group successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async removeMembersFromGroup(req, res) {
    try {
      const groupId = req.params.groupId;
      // validate groupId
      if (!groupId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Group ID is missing",
        });
      }
      // validate memberIds
      const memberIds = req.body.memberIds;
      if (!memberIds) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Member IDs are missing",
        });
      }
      // remove members from group
      const resultFromDb = await GroupService.removeMembersFromGroup(
        groupId,
        memberIds
      );
      // return updated doc to client
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Users has been removed from group successfully.",
      });
    } catch (e) {
      res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = GroupController;
