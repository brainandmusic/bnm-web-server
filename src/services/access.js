const UserService = require("../api/users/service");

/*
 * isAdmin
 *
 * Check if current user is an admin.
 *
 * If so, invoke next(); otherwise terminate the request.
 *
 * PRE: user has to login first.
 */
async function isAdmin(req, res, next) {
  try {
    // read user id from request
    const uid = req.body.id;
    // validate uid
    if (!uid) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "User ID is missing.",
      });
    }
    const userFromDb = await UserService.readUserById(uid);
    // validate user account
    if (!userFromDb) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Invalid user ID.",
      });
    }
    // validate user permission
    if (!userFromDb.roles.includes("admin")) {
      return res.json({
        status: "REQUEST_DENIED",
        message:
          "You need to have admin access in order to perform this operation",
      });
    }
    next();
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  isAdmin,
};
