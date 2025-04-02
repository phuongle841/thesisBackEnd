const { Router } = require("express");
const loginRouter = Router({ mergeParams: true });
const { login, checkToken } = require("../controllers/loginController");

const verifyToken = require("../middlewares/verifyToken");

loginRouter.post("/", login);

loginRouter.get("/", verifyToken, checkToken);
module.exports = loginRouter;
