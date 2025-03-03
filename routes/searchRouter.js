const { Router } = require("express");
const searchController = require("../controllers/searchController");
const searchRouter = Router({ mergeParams: true });
searchRouter.get("/", searchController.searchDatabase);

module.exports = searchRouter;
