const { Router } = require("express");
const reviewController = require("../controllers/reviewController");
const reviewRouter = Router({ mergeParams: true });
const verifyToken = require("../middlewares/verifyToken");

// pre-route name http://locahost:3000/review

reviewRouter.get("/", reviewController.getReviews);
reviewRouter.get("/:reviewId", reviewController.getReview);

reviewRouter.post("/", verifyToken, reviewController.postReview);

reviewRouter.put("/:reviewId", verifyToken, reviewController.putReview);

reviewRouter.delete("/:reviewId", verifyToken, reviewController.deleteReview);

module.exports = reviewRouter;
