const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { productImages: {} },
  });
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
  const products = await prisma.product.findMany();
  res.send(products);
};
module.exports.postProducts = async (req, res) => {
  res.send(req.body);
};
module.exports.putProducts = async (req, res) => {
  const { productId } = req.params;
  const users = await prisma.user.findMany();
  res.send(users);
};
module.exports.deleteProducts = async (req, res) => {
  const { productId } = req.params;
  const users = await prisma.user.findMany();
  res.send(users);
};
