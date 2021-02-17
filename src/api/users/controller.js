const { v4: uuidv4 } = require("uuid");
const EmailService = require("../../services/email");
const JwtService = require("../../services/jwt");
const UserService = require("./service");

class UserController {
  static async register(req, res) {
    try {
      const userInfo = req.body.userInfo;
      // validate user info
      if (
        !userInfo ||
        !userInfo.firstName ||
        !userInfo.lastName ||
        !userInfo.email ||
        !userInfo.password
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User info is incomplete.",
        });
      }
      // check if user has already registered before
      let userFromDb = await UserService.getUsers({ email: userInfo.email });
      if (userFromDb.length != 0) {
        return res.json({
          status: "REQUEST_DENIED",
          message: "This email has already registered.",
        });
      }
      // insert new user into database
      userFromDb = await UserService.createUser(userInfo);
      // send verification email
      await EmailService.sendVerificationEmail(
        userFromDb._id,
        userFromDb.email,
        userFromDb.firstName,
        userFromDb.emailVerifyToken
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: userFromDb,
        message:
          "You account has been created successfully. Please check your email for verifying your account.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async login(req, res) {
    try {
      // read user credentials from request body
      const email = req.body.email;
      const password = req.body.password;
      // validate user credentials
      if (!email) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Email is missing.",
        });
      }
      if (!password) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Password is missing.",
        });
      }
      // find the user from database
      let userFromDb = await UserService.getUsers({ email });
      if (userFromDb.length !== 1) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "This email has not registered yet.",
        });
      }
      userFromDb = userFromDb[0];
      if (!userFromDb.emailVerified) {
        // user account is not verified, login is not permitted
        // send verification email
        await EmailService.sendVerificationEmail(
          userFromDb._id,
          userFromDb.email,
          userFromDb.firstName,
          userFromDb.emailVerifyToken
        );
        return res.json({
          status: "EMAIL_VERIFY_REQUIRED",
          message:
            "We just sent you an email. Please check your inbox and follow the instructions to verify your account before login.",
        });
      }
      // check if password matches
      if (!userFromDb.validPassword(password)) {
        return res.json({
          status: "REQUEST_DENIED",
          message: "Password is incorrect.",
        });
      }
      // generate jwt token
      const token = JwtService.sign(
        { _id: userFromDb._id },
        process.env.USER_AUTH_JWT_SEC_KEY // eslint-disable-line no-undef
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: {
          auth_token: token,
          uid: userFromDb._id,
        },
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      return res.json({
        status: "OK",
        message: "You have logged out successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: "Internal Server Error",
      });
    }
  }

  static async getUser(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User ID is missing",
        });
      }
      const usersFromDb = await UserService.getUsers(
        { _id: userId },
        { password: 0 }
      );
      if (usersFromDb.length === 0) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No user is found.",
        });
      }
      return res.json({
        status: "OK",
        result: usersFromDb[0],
        message: "User is retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getUsers(req, res) {
    try {
      const userIds = req.body.userIds;
      let usersFromDb;
      if (userIds) {
        usersFromDb = await UserService.getUsers(
          { _id: { $in: userIds } },
          { password: 0, emailVerified: 0, emailVerifyToken: 0 }
        );
      } else {
        usersFromDb = await UserService.getUsers(
          {},
          { password: 0, emailVerified: 0, emailVerifyToken: 0 }
        );
      }
      if (usersFromDb.length === 0) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No user is found.",
        });
      }
      return res.json({
        status: "OK",
        result: usersFromDb,
        message: "Users are retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async getRole(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User ID is missing",
        });
      }
      const usersFromDb = await UserService.getUsers(
        { _id: userId },
        { _id: 0, role: 1 }
      );
      if (usersFromDb.length === 0) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "No user is found.",
        });
      }
      return res.json({
        status: "OK",
        result: usersFromDb[0],
        message: "Role is retrieved successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async setRole(req, res) {
    try {
      const userId = req.params.userId;
      const role = req.body.role;
      const resultFromDb = await UserService.updateUsers([userId], { role });
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Role has been set successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async forgetPassword(req, res) {
    try {
      const email = req.body.email;
      if (!email) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Email is missing",
        });
      }
      const userFromDb = await UserService.getUser({ email }, { password: 0 });
      if (!userFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "This account does not exist.",
        });
      }
      // gen new token
      const passwordResetToken = uuidv4().replace(/-/g, "");

      // update user token back to database
      await UserService.updateUser({ email }, { $set: { passwordResetToken } });

      // send password reset email
      await EmailService.sendPasswordResetEmail(
        userFromDb._id,
        userFromDb.email,
        userFromDb.firstName,
        passwordResetToken
      );
      // send response back to the client
      return res.json({
        status: "OK",
        message: "Password reset email has been sent successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const userId = req.params.userId;
      const token = req.params.token;
      const password = req.body.password;
      if (!userId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User ID is missing.",
        });
      }
      if (!token) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Token is missing.",
        });
      }
      if (!password) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Password is missing.",
        });
      }
      let userFromDb = await UserService.getUser({ _id: userId });
      if (!userFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "User ID does not exist.",
        });
      }
      // validate token
      if (
        !userFromDb.passwordResetToken ||
        userFromDb.passwordResetToken !== token
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Token is invalid.",
        });
      }
      // reset password
      const resultFromDb = await UserService.setPassword(userId, password);
      return res.json({
        status: "OK",
        result: resultFromDb,
        message: "Password has been reset successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async sendVerifyEmail(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User ID is missing.",
        });
      }

      let userFromDb = await UserService.getUser(
        { _id: userId },
        { password: 0 }
      );

      if (!userFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "This user does not exist.",
        });
      }

      if (userFromDb.emailVerified) {
        return res.json({
          status: "REQUEST_DENIED",
          message: "This user has already verified account",
        });
      }

      // send verification email
      await EmailService.sendVerificationEmail(
        userFromDb._id,
        userFromDb.email,
        userFromDb.firstName,
        userFromDb.emailVerifyToken
      );
      // send response back to the client
      return res.json({
        status: "OK",
        message: "Verification email has been sent successfully",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const userId = req.params.userId;
      const token = req.params.token;
      if (!userId) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "User ID is missing.",
        });
      }
      if (!token) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Token is missing.",
        });
      }

      let userFromDb = await UserService.getUser({ _id: userId });
      if (!userFromDb) {
        return res.json({
          status: "ZERO_RESULTS",
          message: "User ID does not exist.",
        });
      }

      if (userFromDb.emailVerified) {
        return res.json({
          status: "REQUEST_DENIED",
          message: "This user has already verified account email.",
        });
      }

      // validate token
      if (
        !userFromDb.emailVerifyToken ||
        userFromDb.emailVerifyToken !== token
      ) {
        return res.json({
          status: "INVALID_REQUEST",
          message: "Token is invalid.",
        });
      }
      // reset password
      const filter = { _id: userId };
      const update = { $set: { emailVerifyToken: "", emailVerified: true } };
      await UserService.updateUser(filter, update);
      // generate jwt token
      const jwtToken = JwtService.sign(
        { _id: userFromDb._id },
        process.env.USER_AUTH_JWT_SEC_KEY // eslint-disable-line no-undef
      );
      // send response back to the client
      return res.json({
        status: "OK",
        result: { auth_token: jwtToken, uid: userFromDb._id },
        message: "Your email has been verified successfully.",
      });
    } catch (e) {
      return res.json({
        status: "INTERNAL_ERROR",
        message: e.message,
      });
    }
  }
}

module.exports = UserController;

async function checkAdmin(req, res) {
  try {
    // read user id from request paramters
    const uid = req.body.id;
    // validate user id
    if (!uid) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "User ID is missing.",
      });
    }
    const userFromDb = await UserService.readUserById(uid);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    return res.json({
      status: "OK",
      result: {
        isAdmin: userFromDb.roles.includes("admin"),
      },
      message: `This user is ${userFromDb.roles.includes("admin") ? "" : "not"
        } an admin.`,
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function createUser(req, res) {
  try {
    const newUser = req.body;
    // validate user registration info
    if (!newUser.email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Email is missing.",
      });
    }
    if (!newUser.password) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Password is missing.",
      });
    }
    if (!newUser.firstName || !newUser.lastName) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "First name or last name is missing.",
      });
    }
    // check if user has already registered before
    let userFromDb = await UserService.readUserByEmail(newUser.email);
    if (userFromDb) {
      return res.json({
        status: "REQUEST_DENIED",
        message: "This email has already registered.",
      });
    }
    // insert new user into database
    userFromDb = await UserService.createUser(newUser);
    // send verification email
    await EmailService.sendVerificationEmail(
      userFromDb.email,
      userFromDb.firstName,
      userFromDb.emailVerifyToken
    );
    // send response back to the client
    return res.json({
      status: "OK",
      message:
        "You account has been created successfully. Please check your email for verifying your account.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function deleteUser(req, res) {
  try {
    // read user id from request paramters
    const uid = req.body.id;
    // validate user id
    if (!uid) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "User ID is missing.",
      });
    }
    const deleteResult = await UserService.deleteUserById(uid);
    if (deleteResult.deletedCount !== 1) {
      return res.json({
        status: "ZERO_RESULTS",
        message:
          "Deletion can not be performed. This Account doesn't exist in the database.",
      });
    }
    // send response back to the client
    return res.json({
      status: "OK",
      message: "You account has been deleted successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function getEmailFromPasswordResetToken(req, res) {
  try {
    // read token from request body
    const token = req.body.token;
    // validate token
    if (!token) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Token is missing.",
      });
    }
    const userFromDb = await UserService.readUserByPasswordResetToken(token);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "Invalid token.",
      });
    }
    return res.json({
      status: "OK",
      result: { email: userFromDb.email },
      message: "Email associated with this token is found.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function readUsers(req, res) {
  try {
    // read filter, projection from request paramters
    const filter = req.body.filter || {};
    const projection = req.body.projection || {};
    const projectionKeys = Object.keys(projection);
    for (let i = 0; i < projectionKeys.length; i += 1) {
      const key = projectionKeys[i];
      projection[key] = parseInt(projection[key]);
    }
    const readResult = await UserService.readUsers(filter, projection);
    // send response back to the client
    return res.json({
      status: "OK",
      result: readResult,
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function readUser(req, res) {
  try {
    // read user id from request paramters
    const uid = req.body.id;
    // validate user id
    if (!uid) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "User ID is missing.",
      });
    }
    const readResult = await UserService.readUserById(uid);
    // send response back to the client
    return res.json({
      status: "OK",
      result: readResult,
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function removeAdmin(req, res) {
  try {
    // read new admin email from request body
    const email = req.body.email;
    // validate new admin email
    if (!email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Email is missing.",
      });
    }
    // validate new admin account
    const userFromDb = await UserService.readUserByEmail(email);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    // validate user roles
    if (!userFromDb.roles.includes("admin")) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "This user is not an admin.",
      });
    }
    userFromDb.roles.splice(userFromDb.roles.indexOf("admin"), 1);
    await UserService.updateUserById(userFromDb._id, {
      roles: userFromDb.roles,
    });
    // TODO: remove admin from all the studies s/he was a member of
    return res.json({
      status: "OK",
      message: "This user is removed from admin.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function resetPassword(req, res) {
  try {
    // read email and reset token from request parameters
    const email = req.body.email;
    const passwordResetToken = req.body.token;
    const newPassword = req.body.password;
    // validate user
    const userFromDb = await UserService.readUserByEmail(email);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    // validate token
    if (
      !passwordResetToken ||
      userFromDb.passwordResetToken !== passwordResetToken
    ) {
      return res.json({
        status: "REQUEST_DENIED",
        message:
          "The token has expired. Please request a new password reset email.",
      });
    }
    // save new password and reset passwordResetToken
    userFromDb.password = userFromDb.hashPassword(newPassword);
    await UserService.updateUserById(userFromDb._id, {
      password: userFromDb.password,
      passwordResetToken: "",
    });
    return res.json({
      status: "OK",
      message: "You passsword has been reset successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function sendForgetPasswordEmail(req, res) {
  try {
    // read user email from request parameters
    const email = req.body.email;
    // validate email
    if (!email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Email is missing.",
      });
    }
    const userFromDb = await UserService.readUserByEmail(email);
    // validate user
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    const passwordResetToken = uuidv4().replace(/-/g, "");
    await UserService.updateUserById(userFromDb._id, { passwordResetToken });
    // send password reset email
    await EmailService.sendPasswordResetEmail(
      userFromDb.email,
      userFromDb.firstName,
      passwordResetToken
    );
    // send response back to the client
    return res.json({
      status: "OK",
      message: "Password reset email has been sent successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function sendVerifyEmail(req, res) {
  try {
    // read user email from request parameters
    const email = req.body.email;
    // validate email
    if (!email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Email is missing.",
      });
    }
    const userFromDb = await UserService.readUserByEmail(email);
    // validate user
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    if (userFromDb.emailVerified) {
      return res.json({
        status: "REQUEST_DENIED",
        message: "This email address has already been verified.",
      });
    }
    // send verification email
    await EmailService.sendVerificationEmail(
      userFromDb.email,
      userFromDb.firstName,
      userFromDb.emailVerifyToken
    );
    // send response back to the client
    return res.json({
      status: "OK",
      message: "Verification email has been sent successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function setAdmin(req, res) {
  try {
    // read new admin email from request body
    const email = req.body.email;
    // validate new admin email
    if (!email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "New admin email is missing.",
      });
    }
    // validate new admin account
    const userFromDb = await UserService.readUserByEmail(email);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    // validate user roles
    if (userFromDb.roles.includes("admin")) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "This user is already an admin.",
      });
    }
    userFromDb.roles.push("admin");
    await UserService.updateUserById(userFromDb._id, {
      roles: userFromDb.roles,
    });
    return res.json({
      status: "OK",
      message: "This user is added as admin.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function updateUser(req, res) {
  try {
    // read user id from request paramters
    const uid = req.body.id;
    // validate user id
    if (!uid) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "User ID is missing.",
      });
    }
    const updatedData = req.body;
    const updateResult = await UserService.updateUserById(uid, updatedData);
    // send response back to the client
    return res.json({
      status: "OK",
      result: updateResult,
      message: "Your profile has been updated successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function updateUsers(req, res) {
  try {
    // read filter, update and options from request paramters
    const filter = req.body.filter;
    const update = req.body.update;
    const options = req.body.options;
    const updateResult = await UserService.updateUsers(filter, update, options);
    // send response back to the client
    return res.json({
      status: "OK",
      result: updateResult,
      message: "User information has been updated successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    // read user email and verification token from request paramters
    const email = req.body.email;
    const token = req.body.token;
    // validate email
    if (!email) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Email is missing.",
      });
    }
    // validate token
    if (!token) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Token is missing.",
      });
    }
    const userFromDb = await UserService.readUserByEmail(email);
    // validate user
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
      });
    }
    // user should not have been verified
    if (userFromDb.emailVerified) {
      return res.json({
        status: "REQUEST_DENIED",
        message: "This email address has already been verified.",
      });
    }
    // token in the request should match the one from database
    if (userFromDb.emailVerifyToken !== token) {
      return res.json({
        status: "REQUEST_DENIED",
        message: "Verification failure! Token does not match.",
      });
    }
    await UserService.updateUserById(userFromDb._id, {
      emailVerified: true,
      emailVerifyToken: "",
    });
    // generate jwt token
    const jwtToken = JwtService.sign(
      { _id: userFromDb._id },
      process.env.USER_AUTH_JWT_SEC_KEY // eslint-disable-line no-undef
    );
    // send response back to the client
    return res.json({
      status: "OK",
      result: { token: jwtToken },
      message: "Your email has been verified successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}
