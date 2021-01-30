const StudyService = require("./service");

async function createStudy(req, res) {
  try {
    const study = {};
    // read study info from request
    study.name = req.body.name;
    study.description = req.body.description;
    study.creator = req.body.id;
    study.members = req.body.members || [];
    study.experiments = req.body.experiments || [];
    // validate study name
    if (!study.name) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Study name is missing.",
      });
    }

    const studyFromDb = await StudyService.createStudy(study);
    // send response back to the client
    return res.json({
      status: "OK",
      result: studyFromDb,
      message: "Study has been created successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

async function getStudies(req, res) {
  try {
    // read filter from request
    let filter = req.body.filter || {};
    let projection = req.body.projection || {};
    // validate filter
    if (!filter) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Filter is missing.",
      });
    }

    const studiesFromDb = await StudyService.readStudies(filter, projection);
    if (!studiesFromDb) {
      return res.json({
        status: "ZERO_RESULTS",
        message: "No match studies are found",
      });
    }
    // send response back to the client
    return res.json({
      status: "OK",
      result: studiesFromDb,
      message: "Studies have been retrieved successfully.",
    });
  } catch (e) {
    return res.json({
      status: "INTERNAL_ERROR",
      message: e.message,
    });
  }
}

module.exports = {
  createStudy,
  getStudies,
};
