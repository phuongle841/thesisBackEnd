const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const parse = require("csv-parser");

const { CategoryModel } = require("./modelFacade/Category");
const { ProductModel } = require("./modelFacade/Product");
const path = require("path");
const { UserModel } = require("./modelFacade/User");

const prisma = new PrismaClient();
const productFile = path.resolve(__dirname, "./amazon_products.csv");
const CategoryFile = path.resolve(__dirname, "./amazon_categories.csv");

async function seedCategories() {
  var CategoryData = [];

  fs.createReadStream(CategoryFile)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvRow) {
      CategoryData.push(csvRow);
    })
    .on("end", async () => {
      let result = CategoryModel(CategoryData);
      await prisma.category.createMany({ data: result });
    });
}
async function seedProducts() {
  var productData = [];

  fs.createReadStream(productFile)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvRow) {
      productData.push(csvRow);
    })
    .on("end", async () => {
      const { userId } = await prisma.user.findFirst({});
      let result = ProductModel(productData, userId);
      await prisma.product.createMany({ data: result });
    });
}

async function seedUser() {
  const userEmail = process.env.userEmail;
  const password = process.env.password;
  const userName = process.env.user;

  let result = UserModel([
    {
      userEmail,
      password,
      userName,
    },
  ]);
  const user = await prisma.user.createMany({ data: result });
}

async function main() {
  // await seedUser();
  await seedCategories();
  await seedProducts();
}
// update both schema and prisma client:npx prisma migrate dev

// update schema: npx prisma db push
// update prisma client: npx prisma generate

module.exports.main = main;
