const { v4: uuidv4 } = require("uuid");
const EmailService = require("../../../services/email");
const JwtService = require("../../../services/jwt");
const UserService = require("./service");

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

async function login(req, res) {
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
    // find user from database
    const userFromDb = await UserService.readUserByEmail(email);
    if (!userFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No account is associated with this email.",
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
        token,
        roles: userFromDb.roles,
      },
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

async function logout(req, res) {
  try {
    return res.json({
      status: "OK",
      message: "You have logged out successfully.",
    });
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
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

module.exports = {
  checkAdmin,
  createUser,
  deleteUser,
  getEmailFromPasswordResetToken,
  login,
  logout,
  readUser,
  removeAdmin,
  resetPassword,
  sendForgetPasswordEmail,
  sendVerifyEmail,
  setAdmin,
  updateUser,
  verifyEmail,
};
