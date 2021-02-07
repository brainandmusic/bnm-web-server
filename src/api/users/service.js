// The service class acts like a wrapper for the database. Here we read and write data to the database. Furthermore, we can implement caching for example.
const User = require("./model");

class UserService {
  static createUser(userInfo) {
    const newUser = new User(userInfo);
    newUser.password = newUser.hashPassword(newUser.password);
    return newUser.save({ w: "majority" });
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
}

module.exports = UserService;

// function createUser(user) {
//   const newUser = new User(user);
//   newUser.password = newUser.hashPassword(newUser.password);
//   return newUser.save({ w: "majority" });
// }

// function deleteUserById(id) {
//   const conditions = { _id: id };
//   return User.deleteOne(conditions);
// }

// function readUsers(filter, projection) {
//   return User.find(filter, projection);
// }

// function readUserByEmail(email) {
//   return User.findOne({ email });
// }

// function readUserByPasswordResetToken(token) {
//   const conditions = { passwordResetToken: token };
//   const projection = { email: 1 };
//   return User.findOne(conditions, projection);
// }

// function readUserById(id) {
//   const conditions = { _id: id };
//   const projection = { password: 0 };
//   return User.findOne(conditions, projection);
// }

// function updateUsers(filter, update, options) {
//   return User.updateMany(filter, update, options);
// }

// function updateUserById(id, doc) {
//   const filter = { _id: id };
//   return User.updateOne(filter, doc);
// }

// module.exports = {
//   createUser,
//   deleteUserById,
//   readUsers,
//   readUserByEmail,
//   readUserById,
//   readUserByPasswordResetToken,
//   updateUsers,
//   updateUserById,
// };
