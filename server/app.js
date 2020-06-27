global.config = require(process.env.NODE_ENV === "production"
  ? "./config-prod"
  : "./config-dev");
const express = require("express");
const cors = require("cors");
const authController = require("./controllers/auth-controller");
const vacationsController = require("./controllers/vacations-controller");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
// server.use(express.static(path.join(__dirname, "./_front-end")));

app.use("/api/auth", authController);
app.use("/api/vacations", vacationsController);
// server.use("*", (request, response) => {
//     response.sendFile(path.join(__dirname, "./_front-end/index.html"));
// });
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening on port ` + port));
