const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getReviews = async (req, res, next) => {
  const { reviewId } = req.query;
  try {
    const users = await prisma.review.findUnique({});
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getReview = async (req, res, next) => {
  const { reviewId } = req.query;
  try {
    const users = await prisma.review.findUnique({
      where: { reviewerId: parseInt(reviewId) },
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.putReview = async (req, res, next) => {
  const {
    reviewTitle,
    reviewDescription,
    reviewRating,
    reviewerId,
    productId,
  } = req.body;
  try {
    // const review = await prisma.review.create({
    //   data: {
    //     reviewTitle,
    //     reviewDescription,
    //     reviewRating,
    //     reviewerId,
    //     productId,
    //   },
    // });
    res.send({ message: "called api" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.postReview = async (req, res, next) => {
  const { reviewTitle, reviewDescription, reviewRating, productId } = req.body;

  try {
    const { user } = await prisma.userCredentials.findUnique({
      where: { userEmail: req.authData.userEmail },
      select: { user: true },
    });
    const review = await prisma.review.create({
      data: {
        reviewTitle,
        reviewDescription,
        reviewRating,
        reviewerId: user.userId,
        productId,
      },
    });
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.query;
  try {
    const reviews = await prisma.review.findMany();
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
