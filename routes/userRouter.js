const { Router } = require("express");
const userController = require("../controllers/userController");
const userRouter = Router({ mergeParams: true });
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/users
userRouter.get("/", userController.getUsers);
userRouter.get("/authenticate", verifyToken, userController.getUserByToken);
userRouter.get("/:userId", userController.getUser);
userRouter.get("/:userId/cart", verifyToken, userController.getUserCart);
userRouter.get("/:userId/order", verifyToken, userController.getUserOrders);
userRouter.get("/:userId/reviews", userController.getUserReviews);

userRouter.put("/:userId/cart", verifyToken, userController.putUserCart);

userRouter.post("/:userid/order", verifyToken, userController.postUserOrder);
userRouter.post("/", userController.postUsers);

userRouter.delete("/:userId", userController.deleteUsers);

module.exports = userRouter;
