// The service class acts like a wrapper for the database. Here we read and write data to the database. Furthermore, we can implement caching for example.
const User = require("./model");

function createUser(user) {
  const newUser = new User(user);
  newUser.password = newUser.hashPassword(newUser.password);
  return newUser.save({ w: "majority" });
}

function deleteUserById(id) {
  const conditions = { _id: id };
  return User.deleteOne(conditions);
}

function readUsers(filter, projection) {
  return User.find(filter, projection);
}

function readUserByEmail(email) {
  return User.findOne({ email });
}

function readUserByPasswordResetToken(token) {
  const conditions = { passwordResetToken: token };
  const projection = { email: 1 };
  return User.findOne(conditions, projection);
}

function readUserById(id) {
  const conditions = { _id: id };
  const projection = { password: 0 };
  return User.findOne(conditions, projection);
}

function updateUserById(id, doc) {
  const filter = { _id: id };
  return User.updateOne(filter, doc);
}

module.exports = {
  createUser,
  deleteUserById,
  readUsers,
  readUserByEmail,
  readUserById,
  readUserByPasswordResetToken,
  updateUserById,
};
