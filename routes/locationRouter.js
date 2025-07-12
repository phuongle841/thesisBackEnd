const { Router } = require("express");
const locationRouter = Router({ mergeParams: true });
const locationController = require("../controllers/locationController");
const verifyToken = require("../middlewares/verifyToken");
const adminRouter = require("./adminRouter");

locationRouter.get("/:userId", verifyToken, locationController.getLocation);
locationRouter.post("/:userId", verifyToken, locationController.getLocation);
locationRouter.put("/:userId", verifyToken, locationController.getLocation);
locationRouter.delete("/:userId", verifyToken, locationController.getLocation);

module.exports = locationRouter;
