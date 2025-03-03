const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getProducts = async (req, res) => {
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
