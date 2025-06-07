const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.searchDatabase = async (req, res, next) => {
  const { product } = req.query;

  const maxResults = 10;
  const query = `%${product}%`;

  try {
    const productIds =
      await prisma.$queryRaw`SELECT "productId" FROM "Product" WHERE LOWER("productName") LIKE LOWER(${query})`;

    const ids = productIds.map((e) => e.productId);
    const products = await prisma.product.findMany({
      where: { productId: { in: ids } },
    });
    res.send(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
