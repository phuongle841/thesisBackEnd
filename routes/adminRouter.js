const { Router } = require("express");
const adminRouter = Router({ mergeParams: true });
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/admin

adminRouter.get("/authenticate", verifyToken, adminController.authenticate);

adminRouter.get("/:userId", verifyToken, adminController.getProductData);
adminRouter.get(
  "/:userId/update",
  verifyToken,
  adminController.getUpdatedProductData
);
adminRouter.put("/:userId", adminController.putProductData);

adminRouter.get(
  "/:userId/inventory",
  verifyToken,
  adminController.getInventory
);
adminRouter.put(
  "/:userId/inventory",
  verifyToken,
  adminController.putInventory
);

adminRouter.get("/:userId/orders", verifyToken, adminController.getOrders);
adminRouter.put("/:userId/orders", verifyToken, adminController.putOrder);

adminRouter.get(
  "/:userId/feedbacks",
  verifyToken,
  adminController.getFeedbacks
);

module.exports = adminRouter;
