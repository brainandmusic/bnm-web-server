const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const userRoute = require("./src/api/users/route");
const experimentRoute = require("./src/api/experiments/route");
const studyRoute = require("./src/api/components/study/route");
const groupsRoute = require("./src/api/groups/route");

dotenv.config();

mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("returnOriginal", false);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); // eslint-disable-line no-undef

const app = express();
const port = process.env.PORT || 8000; // eslint-disable-line no-undef

app.use(cors());

app.use(morgan("tiny"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/groups", groupsRoute);
app.use("/api/v1/experiments", experimentRoute);
app.use("/api/v1/study", studyRoute);

app.get("/", (req, res) => {
  res.send("Brain and Music Lab backend is running");
});

app.post("/", (req, res) => {
  // echo the request body
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`); // eslint-disable-line no-console
});
