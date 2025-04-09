const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const util = require("util");

const parse = require("csv-parser");

const { CategoryModel } = require("./modelFacade/Category");
const { ProductModel } = require("./modelFacade/Product");
const path = require("path");
const { UserModel } = require("./modelFacade/User");
const { randomIntFromInterval } = require("../utils/randomInterval");

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

async function updateProductCategoryRelationship() {
  const productsWithOutCategory = await prisma.product.findMany({
    where: { Category: { none: {} } },
    select: { productId: true },
  });
  const categories = await prisma.category.findMany({
    select: { categoryId: true },
  });
  const productList = productsWithOutCategory.map((e) => e.productId);
  const categoryList = categories.map((e) => e.categoryId);
  const data = [];
  for (let i = 0; i < productList.length; i++) {
    const productId = productList[i];
    const connect = [];
    for (let j = 0; j < 4; j++) {
      const index =
        i * 4 + j < categoryList.length - 1
          ? categoryList[i * 4 + j]
          : randomIntFromInterval(0, categoryList.length - 1);
      const element = categoryList[index];
      connect.push({ categoryId: element });
    }
    data.push({ productId, connect });
  }
  for (const element of data) {
    await prisma.product.update({
      where: { productId: element.productId },
      data: { Category: { connect: element.connect } },
    });
  }
}

async function updateProductImage() {
  const result = await prisma.category.findMany({
    select: {
      categoryId: true,
      product: {
        select: { productImages: true, productId: true },
        take: 1,
        skip: 1,
      },
    },
  });
  const imageList = result.map((element) => {
    const { product, categoryId } = element;
    const { productImages, productId } = product[0];
    const categoryImage = productImages[0];
    return { categoryImage, categoryId };
  });
  for (const category of imageList) {
    const result = await prisma.category.update({
      where: { categoryId: category.categoryId },
      data: { categoryImage: category.categoryImage },
    });
  }
}

async function main() {
  // await seedUser();
  // await seedCategories();
  // await seedProducts();
  // await updateProductCategoryRelationship();
  await updateProductImage();
}

// update both schema and prisma client:npx prisma migrate dev

// update schema: npx prisma db push
// update prisma client: npx prisma generate

module.exports.main = main;
