const { Router } = require("express");
const signupRouter = Router({ mergeParams: true });
const controller = require("../../controllers/signupController");
// default route url http://localhost:3000/signup

signupRouter.post("/", controller.signup);
module.exports = signupRouter;
