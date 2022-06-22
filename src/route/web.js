import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  router.get("/contact", homeController.getContactPage);

  router.get("/about", (req, res) => {
    return res.send("About Me");
  });

  return app.use("/", router);
};

module.exports = initWebRoutes;
