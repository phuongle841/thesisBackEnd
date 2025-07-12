const { Router } = require("express");
const categoriesController = require("../controllers/categoryController");
const categoryRouter = Router({ mergeParams: true });
// http://localhost:3000/categories
categoryRouter.get("/", categoriesController.getCategories);
categoryRouter.get("/:categoryId", categoriesController.getCategoryById);
categoryRouter.post("/", categoriesController.postCategories);
categoryRouter.put("/:categoryId", categoriesController.putCategories);
categoryRouter.delete("/:categoryId", categoriesController.deleteCategories);
module.exports = categoryRouter;
