const { Router } = require("express");
const cartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/verifyToken");
const cartRouter = Router({ mergeParams: true });
// route: http://localhost:3000/cart
cartRouter.get("/", verifyToken, cartController.getCart);
module.exports = cartRouter;
