require("dotenv").config();
const nodemailer = require("nodemailer");

/*
 * For 534-5.7.14 (Invalid login) error,
 * first check the inbox to see if there is any security alert email. Allow
 * the access mentioned in the email; second, check if email address and
 * password are correct; thirdly, check if allow less secure app is turned on;
 * lastly, follow below link or go to https://g.co/allowaccess  or
 * https://accounts.google.com/DisplayUnlockCaptcha to allow access and
 * restart the server again.
 *
 * https://support.google.com/accounts/answer/6009563
 *
 */
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

async function sendPasswordResetEmail(uid, toAddress, toName, token) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"USC Creative Minds Lab",<uscbnm@gmail.com>', // sender address
      to: toAddress, // list of receivers
      subject: "Reset your password for USC Creative Minds Lab", // Subject line
      html:
        "<p>Dear " +
        toName +
        ",</p>" +
        "<p>Please click below link to reset your password:</p>" +
        "<a href='" +
        process.env.CLIENT_URL + // eslint-disable-line no-undef
        "/accounts/" +
        uid +
        "/resetpassword/token/" +
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

async function sendVerificationEmail(uid, toAddress, toName, token) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"USC Creative Minds Lab",uscbnm@gmail.com', // sender address
      to: toAddress, // list of receivers
      subject: "Verify Email Address for USC Creative Minds Lab", // Subject line
      html:
        "<p>Dear " +
        toName +
        ",</p>" +
        "<p>Thanks for registering for an account on USC Creative Minds Lab!</p>" +
        "<p>Before we get started, we just need to confirm that this is you. Click below to verify your email address:</p>" +
        "<a href='" +
        process.env.CLIENT_URL + // eslint-disable-line no-undef
        "/accounts/" +
        uid +
        "/verify/token/" +
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
