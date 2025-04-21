const { Router } = require("express");
const locationRouter = Router({ mergeParams: true });
const locationController = require("../controllers/locationController");
const verifyToken = require("../middlewares/verifyToken");
const adminRouter = require("./adminRouter");

locationRouter.get("/:userId", verifyToken, locationController.getLocation);
module.exports = locationRouter;
