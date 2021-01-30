const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const userRoute = require("./src/api/components/user/route");
const experimentRoute = require("./src/api/components/experiment/route");
const studyRoute = require("./src/api/components/study/route");

dotenv.config();

mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); // eslint-disable-line no-undef

const app = express();
const port = process.env.PORT || 8000; // eslint-disable-line no-undef

app.use(cors());

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/experiment", experimentRoute);
app.use("/api/v1/study", studyRoute);

app.get("/", (req, res) => {
  res.send("Brain and Music Lab backend is running");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`); // eslint-disable-line no-console
});
