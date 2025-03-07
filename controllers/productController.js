const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany({ skip: 1000, take: 30 });
  res.send(products);
};
module.exports.getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { productId: parseInt(productId) },
    include: { Category: true },
  });
  res.send(product);
};
module.exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const products = await prisma.category.findMany({
    where: { categoryId: categoryId },
    include: { product: true },
  });
  res.send(products);
};
module.exports.postProducts = async (req, res) => {
  const {
    productName,
    productImages,
    productRating,
    productPrice,
    productDescription,
    productDetails,
  } = req.body;
  productRating = 5;
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
};
module.exports.putProducts = async (req, res) => {
  const { productId } = req.params;
  const { data } = req.body;
  const user = await prisma.user.update({
    where: { productId: productId },
    data: { data },
  });
  res.send(user);
};
module.exports.deleteProducts = async (req, res) => {
  const { productId } = req.params;
  const users = await prisma.user.delete({ where: { productId: productId } });
  res.send(users);
};
