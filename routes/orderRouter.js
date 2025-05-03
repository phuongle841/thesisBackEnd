const { Router } = require("express");
const orderController = require("../controllers/orderController");
const orderRouter = Router({ mergeParams: true });
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/orders
orderRouter.get("/", orderController.getOrders);
orderRouter.get("/user/:userId", orderController.getOrder);

orderRouter.post("/user/:userId", verifyToken, orderController.postOrders);

orderRouter.delete("/user/:userId", orderController.getOrders);

module.exports = orderRouter;
