const Controller = require("../controllers/appController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.get("/survey", Controller.refactoreMe1);
  router.post("/survey", Controller.refactoreMe2);
  router.get("/attacks", Controller.getData);

  app.use("/api/data", router);
};
