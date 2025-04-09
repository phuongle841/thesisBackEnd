const { randomIntFromInterval } = require("../../utils/randomInterval");

module.exports.ProductModel = (data, userId) => {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    const { title, imgUrl, stars, price, category_id } = data[i];
    let productImages = [imgUrl];
    for (let j = 1; j < 10; j++) {
      const position = i + j;
      if (position < data.length) {
        const { imgUrl } = data[position];
        productImages.push(imgUrl);
      }
    }
    i += 9;
    const input = {
      // Change to right model in database
      productName: title,
      productImages: productImages,
      productRating: parseInt(stars),
      productPrice: parseFloat(price),
      productDescription: "",
      productDetails: "",
      userId: userId,
    };
    result.push(input);
  }
  return result;
};
