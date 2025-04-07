const { Router } = require("express");
const userController = require("../controllers/userController");
const userRouter = Router({ mergeParams: true });
userRouter.get("/:userId/reviews", userController.getUserReviews);
userRouter.get("/:userId", userController.getUser);
userRouter.get("/", userController.getUsers);

userRouter.put("/:userId", userController.putUsers);

userRouter.delete("/:userId", userController.deleteUsers);

userRouter.post("/", userController.postUsers);

module.exports = userRouter;
