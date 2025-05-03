const { Router } = require("express");
const adminRouter = Router({ mergeParams: true });
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/admin
adminRouter.get(
  "/:userId/feedbacks",
  verifyToken,
  adminController.getFeedbacks
);
adminRouter.get("/:userId", verifyToken, adminController.getProductData);

module.exports = adminRouter;
