const jwt = require("jsonwebtoken");

function sign(payload, sec_key) {
  // TODO: replace secret key
  return jwt.sign(payload, sec_key);
}

function verify(token, sec_key) {
  // TODO: replace secret key
  return jwt.verify(token, sec_key);
}

module.exports = {
  sign,
  verify,
};
