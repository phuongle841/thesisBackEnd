const { Router } = require("express");
const appController = require("../controllers/appController");
const appRouter = Router({ mergeParams: true });
appRouter.get("/", appController.getUsers);

module.exports = appRouter;
