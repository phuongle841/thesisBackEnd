const { Router } = require("express");
const loginRouter = Router({ mergeParams: true });
const controller = require("../controllers/loginController");

// default route url http://localhost:3000/login

const verifyToken = require("../middlewares/verifyToken");

loginRouter.post("/", controller.login);
loginRouter.post("/signup", controller.signup);

loginRouter.get("/", verifyToken, controller.checkToken);
module.exports = loginRouter;
