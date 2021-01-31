const Study = require("./model");

function createStudy(study) {
  const newStudy = new Study(study);
  return newStudy.save({ w: "majority" });
}

function deleteStudies(filter) {
  return Study.deleteMany(filter);
}

function readStudies(filter, projection) {
  return Study.find(filter, projection);
}

module.exports = {
  createStudy,
  deleteStudies,
  readStudies,
};
