const { Router } = require("express");
const paymentController = require("../controllers/paymentController");
const paymentRouter = Router({ mergeParams: true });
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/users
// paymentRouter.get("/", paymentController.getUsers);

paymentRouter.post(
  "/:userId/order",
  verifyToken,
  paymentController.postUserOrder
);

module.exports = paymentRouter;
