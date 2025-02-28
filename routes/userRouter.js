const { Router } = require("express");
const userController = require("../controllers/userController");
const userRouter = Router({ mergeParams: true });
userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.postUsers);
userRouter.put("/:userId", userController.putUsers);
userRouter.delete("/:userId", userController.deleteUsers);

module.exports = userRouter;
