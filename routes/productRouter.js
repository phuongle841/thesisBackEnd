const { Router } = require("express");
const productController = require("../controllers/productController");
const productRouter = Router({ mergeParams: true });
productRouter.get("/", productController.getProducts);
productRouter.get("/:productId", productController.getProductById);
productRouter.get("/:categoryId", productController.getProductsByCategory);

productRouter.post("/", productController.postProducts);

productRouter.put("/:productId", productController.putProducts);

productRouter.delete("/:productId", productController.deleteProducts);

module.exports = productRouter;
