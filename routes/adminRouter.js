const { Router } = require("express");
const adminRouter = Router({ mergeParams: true });
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyToken");

adminRouter.get("/", adminController.getProductData);

module.exports = adminRouter;
