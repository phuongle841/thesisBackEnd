const { PrismaClient } = require("@prisma/client");
const { randomIntFromInterval } = require("../utils/randomInterval");
const prisma = new PrismaClient();
async function seedProducts() {
  // const connect = [1, 2, 3].map((i) => {
  //   return { categoryId: i };
  // });
  // const product = await prisma.product.update({
  //   where: { productId: 9001 },
  //   data: { Category: { connect: connect } },
  // });
  const product = await prisma.product.findUnique({
    where: { productId: 9001 },
    include: { Category: { select: { categoryId: true } } },
  });
  console.log(product);
}

async function main() {
  await seedProducts();
}
main();
