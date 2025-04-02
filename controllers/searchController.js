const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.searchDatabase = async (req, res) => {
  const { product } = req.query;
  const maxResults = 10;
  const query = `%${product}%`;

  const products =
    await prisma.$queryRaw`SELECT "productName","productId" FROM "Product" WHERE LOWER("productName") LIKE LOWER(${query})`;

  console.log("Result:\n", products);

  res.send(products);
};
