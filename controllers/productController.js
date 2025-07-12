const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ take: 30 });
    res.send(products);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
module.exports.getProductById = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
      include: {
        Category: true,
        owner: true,
        reviewed: { include: { reviewer: true } },
      },
    });
    res.send(product);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
module.exports.getProductsByCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.category.findMany({
      where: { categoryId: categoryId },
      include: { product: true },
    });
    res.send(products);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
module.exports.postProducts = async (req, res, next) => {
  const {
    productName,
    productImages,
    productRating,
    productPrice,
    productDescription,
    productDetails,
  } = req.body;
  productRating = 5;
  try {
    let result = await prisma.product.create({
      data: {
        productName: productName,
        productImages: productImages,
        productRating: null,
        productPrice: productPrice,
        productDescription: productDescription,
        productDetails: productDetails,
      },
    });
    res.send(result);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
module.exports.putProducts = async (req, res, next) => {
  const { productId } = req.params;
  const { data } = req.body;
  try {
    const user = await prisma.user.update({
      where: { productId: productId },
      data: { data },
    });
    res.send(user);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
module.exports.deleteProducts = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const users = await prisma.user.delete({
      where: { productId: parseInt(productId) },
    });
    res.send(users);
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};
