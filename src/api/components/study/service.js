const Study = require("./model");

function createStudy(study) {
  const newStudy = new Study(study);
  return newStudy.save({ w: "majority" });
}

function readStudies(filter, projection) {
  return Study.find(filter, projection);
}

module.exports = {
  createStudy,
  readStudies,
};
