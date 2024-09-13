const Controller = require("../controllers/appController");
const verifyToken = require("../middleware/authMiddleware");

exports.httpRoutes = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  // use auth middleware
  router.get("/survey", verifyToken, Controller.refactoreMe1);

  router.post("/survey", Controller.refactoreMe2);
  router.get("/attacks", Controller.getData);

  app.use("/api/data", router);
};

exports.wsRoutes = (app) => {
  app.ws("/app/data", Controller.callmeWebSocket);
};

exports.authRoutes = (app) => {
  const router = require("express").Router();

  router.get("/getToken", Controller.generateToken);

  app.use("/api", router);
};
