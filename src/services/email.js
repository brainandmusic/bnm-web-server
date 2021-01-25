require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_VERIFY_SENDER_EMAIL, // eslint-disable-line no-undef
    pass: process.env.USER_VERIFY_SENDER_PWD, // eslint-disable-line no-undef
  },
});

async function sendPasswordResetEmail(toAddress, toName, token) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"USC Brain and Music Lab",<uscbnm@gmail.com>', // sender address
      to: toAddress, // list of receivers
      subject: "Reset your password for USC Brain&Music Lab", // Subject line
      html:
        "<p>Dear " +
        toName +
        ",</p>" +
        "<p>Please click below link to reset your password:</p>" +
        "<a href='" +
        process.env.CLIENT_URL + // eslint-disable-line no-undef
        "/account/current/resetpassword/token/" +
        token +
        "'>Reset Password</a>" +
        "<p>Note: if you didn't initiate this operation, please ignore this email.</p>",
    });
    return {
      status: "OK",
      message: "Email (id: " + info.messageId + ") sent successfully",
    };
  } catch (e) {
    return {
      status: "UNKNOWN_ERROR",
      message: "Internal emailing error: " + e,
    };
  }
}

async function sendVerificationEmail(toAddress, toName, token) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"USC Brain and Music Lab",uscbnm@gmail.com', // sender address
      to: toAddress, // list of receivers
      subject: "Verify Email Address for USC Brain&Music Lab", // Subject line
      html:
        "<p>Dear " +
        toName +
        ",</p>" +
        "<p>Thanks for registering for an account on USC Brain & Music Lab!</p>" +
        "<p>Before we get started, we just need to confirm that this is you. Click below to verify your email address:</p>" +
        "<a href='" +
        process.env.CLIENT_URL + // eslint-disable-line no-undef
        "/account/new/verify/email/" +
        toAddress +
        "/token/" +
        token +
        "'>Verify Email</a>", // html body
    });
    return {
      status: "OK",
      message: "Email (id: " + info.messageId + ") sent successfully",
    };
  } catch (e) {
    return {
      status: "UNKNOWN_ERROR",
      message: "Internal emailing error: " + e,
    };
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
};
