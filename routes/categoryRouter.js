const { Router } = require("express");
const categoriesController = require("../controllers/categoryController");
const categoryRouter = Router({ mergeParams: true });
categoryRouter.get("/", categoriesController.getCategories);

module.exports = categoryRouter;
