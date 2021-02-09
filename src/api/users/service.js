// The service class acts like a wrapper for the database. Here we read and write data to the database. Furthermore, we can implement caching for example.
const User = require("./model");

class UserService {
  static createUser(userInfo) {
    const newUser = new User(userInfo);
    newUser.password = newUser.hashPassword(newUser.password);
    return newUser.save({ w: "majority" });
  }

  static getUser(filter = {}, projection = {}, options = {}) {
    return User.findOne(filter, projection, options);
  }

  static updateUser(filter = {}, update = {}, options = {}) {
    return User.findOneAndUpdate(filter, update, options);
  }

  static getUsers(filter = {}, projection = {}, options = {}) {
    return User.find(filter, projection, options);
  }

  static updateUsers(userIds, updatedFields) {
    const filter = { _id: { $in: userIds } };
    const update = { $set: updatedFields };
    return User.updateMany(filter, update);
  }

  static deleteUsers(userIds) {
    const filter = { _id: { $in: userIds } };
    return User.deleteMany(filter);
  }

  static setPassword(userId, newPwd) {
    const filter = { _id: userId };
    const update = {
      password: User.hashPassword(newPwd),
      passwordResetToken: "",
    };
    return User.findOneAndUpdate(filter, update);
  }
}

module.exports = UserService;
