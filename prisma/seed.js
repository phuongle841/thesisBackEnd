const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
console.log("... seeding");
const prisma = new PrismaClient();

function createRandomProduct() {
  return {
    productName: faker.commerce.product(),
    productImages: [faker.image.avatar()],
    productRating: faker.number.int({ min: 1, max: 5 }),
    productPrice: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
    productDescription: faker.image.url(),
    productDetails: "",
    productRelatedId: faker.number.int({ min: 1, max: 5 }),
  };
}
faker.seed(123);
const products = faker.helpers.multiple(createRandomProduct, {
  count: 20,
});

async function main() {
  await prisma.product.createMany({ data: products });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
