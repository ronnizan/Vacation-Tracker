global.config = require(process.env.NODE_ENV === "production"
  ? "./config-prod"
  : "./config-dev");
// const socketIO = require('socket.io');
const express = require("express");
const cors = require("cors");
const authController = require("./controllers/auth-controller");
const vacationsController = require("./controllers/vacations-controller");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");



const app = express();


app.use(fileUpload());
app.use(cors());
app.use(express.json());

//make file
if (!fs.existsSync('../client/public/assets/images/')) {
  fs.mkdirSync('../client/public/assets/images/');
}

// server.use(express.static(path.join(__dirname, "./_front-end")));
app.use(express.static(__dirname)); // "/" ==> "index.html"
app.use("/api/auth", authController);
app.use("/api/vacations", vacationsController);
// server.use("*", (request, response) => {
//     response.sendFile(path.join(__dirname, "./_front-end/index.html"));
// });
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening on port ` + port));


//socket:
// const expressListener = server.listen(3000, () => console.log('server is online'));
// const socketIOServer = socketIO(expressListener);
// socketIOServer.sockets.on("connection", async socket => {
//     socket.on('get-all-vacations', async () => {
//         socketIOServer.sockets.emit("get-all-vacations", await vacationsLogic.getAllVacations());
//     });
//     socket.on("msg-from-client", msg => console.log(socket.id + ": " + msg));
// });