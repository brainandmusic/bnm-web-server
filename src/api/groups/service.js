const Group = require("./model");

class GroupService {
  static createGroup(newGroup) {
    const g = new Group(newGroup);
    return g.save();
  }

  static deleteGroups(groupIds) {
    const filter = { _id: { $in: groupIds } };
    return Group.deleteMany(filter);
  }

  static getGroups(filter = {}, projection = {}, options = {}) {
    return Group.find(filter, projection, options);
  }

  static addMembersToGroup(groupId, newMembers) {
    const filter = { _id: groupId };
    const update = { $addToSet: { members: { $each: newMembers } } };
    return Group.findOneAndUpdate(filter, update);
  }

  static removeMembersFromGroup(groupId, oldMembers) {
    const filter = { _id: groupId };
    const update = { $pull: { members: { $in: oldMembers } } };
    return Group.findOneAndUpdate(filter, update);
  }
}

module.exports = GroupService;
