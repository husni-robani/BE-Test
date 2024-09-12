const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const controller = require("./app/controllers/appController");

const express = require("express");
const app = express();

const expressWs = require("express-ws")(app);

const corsOptions = {
  origin: ["http://localhost:8080"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// routes
require("./app/routes/appRoutes")(app);

// websocket route
const Controller = require("./app/controllers/appController");
app.ws("/app/data", Controller.callmeWebSocket);

const PORT = 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
