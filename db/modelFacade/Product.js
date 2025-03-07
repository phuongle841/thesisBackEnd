const { randomIntFromInterval } = require("../../utils/randomInterval");

module.exports.ProductModel = (data) => {
  const result = data.map((csvrow) => {
    const { title, imgUrl, productUrl, stars, price, category_id } = csvrow;
    const input = {
      // Change to right model in database
      productName: title,
      productImages: [imgUrl],
      productRating: parseInt(stars),
      productPrice: parseFloat(price),
      Category: [category_id],
      productDescription: "",
      productDetails: "",
    };
    return input;
  });
  return result;
};
