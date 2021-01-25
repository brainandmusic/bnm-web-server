// Here we setup things like our passport strategies and define authorization methods.
const JwtService = require("./jwt");

function checkLogin(req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.json({
        status: "REQUEST_DENIED",
        message: "Login is required.",
      });
    }
    // parse bearer from authorization header
    const userJwt = authHeader.slice("Bearer ".length);
    try {
      const decodedJwt = JwtService.verify(
        userJwt,
        process.env.USER_AUTH_JWT_SEC_KEY // eslint-disable-line no-undef
      );
      // add user id to request body
      req.body.id = decodedJwt._id;
      // user is logged in, invoke next middleware
      next();
    } catch (e) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "JWT token is not valid.",
      });
    }
  } catch (e) {
    return res.json({
      status: "UNKNOWN_ERROR",
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  checkLogin,
};
