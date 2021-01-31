const StudyService = require("./service");

async function createStudy(req, res) {
  try {
    // read study info from request
    const study = req.body;
    study.creator = req.body.id;
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

async function deleteStudies(req, res) {
  try {
    // read filter from request
    let filter = req.body.filter;
    // validate filter
    if (!filter) {
      return res.json({
        status: "INVALID_REQUEST",
        message: "Filter is missing.",
      });
    }

    const deleteResutl = await StudyService.deleteStudies(filter);
    // send response back to the client
    return res.json({
      status: "OK",
      result: deleteResutl,
      message: "Studies have been deleted successfully.",
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
    const projectionKeys = Object.keys(projection);
    for (let i = 0; i < projectionKeys.length; i += 1) {
      const key = projectionKeys[i];
      projection[key] = parseInt(projection[key]);
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
  deleteStudies,
  getStudies,
};
