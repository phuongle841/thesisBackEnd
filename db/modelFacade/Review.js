const { randomIntFromInterval } = require("../../utils/randomInterval");

randomIntFromInterval;
module.exports.ReviewModel = (data) => {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    const {
      reviewTitle,
      reviewDescription,
      reviewRating,
      reviewerId,
      productId,
    } = data[i];
    const input = {
      // Change to right model in database
      reviewTitle,
      reviewDescription,
      reviewRating: parseInt(reviewRating),
      reviewerId: parseInt(reviewerId),
      productId: parseInt(productId),
    };
    result.push(input);
  }
  return result;
};
