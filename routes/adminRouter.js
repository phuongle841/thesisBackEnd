const { Router } = require("express");
const adminRouter = Router({ mergeParams: true });
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/admin
adminRouter.get("/:userId", verifyToken, adminController.getProductData);
adminRouter.put("/:userId", adminController.putProductData);

adminRouter.get("/:userId/inventory", adminController.getInventory);

adminRouter.get(
  "/:userId/feedbacks",
  verifyToken,
  adminController.getFeedbacks
);

module.exports = adminRouter;
