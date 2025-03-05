const { Router } = require("express");
const categoriesController = require("../controllers/categoryController");
const categoryRouter = Router({ mergeParams: true });
categoryRouter.get("/", categoriesController.getCategories);
categoryRouter.get(
  "/:categoryId/products",
  categoriesController.getCategoriesById
);
categoryRouter.post("/", categoriesController.postCategories);
categoryRouter.put("/:categoryId", categoriesController.putCategories);
categoryRouter.delete("/:categoryId", categoriesController.deleteCategories);
module.exports = categoryRouter;
