const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const util = require("util");

const parse = require("csv-parser");

const { CategoryModel } = require("./modelFacade/Category");
const { ProductModel } = require("./modelFacade/Product");
const path = require("path");
const { UserModel } = require("./modelFacade/User");
const { ReviewModel } = require("./modelFacade/Review");
const { randomIntFromInterval } = require("../utils/randomInterval");

const prisma = new PrismaClient();
const productFile = path.resolve(__dirname, "./archive/amazon_products.csv");
const CategoryFile = path.resolve(__dirname, "./archive/amazon_categories.csv");
const reviewFile = path.resolve(__dirname, "./archive/fake_reviews.csv");

async function seedCategories() {
  return new Promise((resolve, reject) => {
    console.log("seeding categories");
    const CategoryData = [];
    fs.createReadStream(CategoryFile)
      .pipe(parse({ delimiter: ":" }))
      .on("data", (csvRow) => {
        CategoryData.push(csvRow);
      })
      .on("end", async () => {
        try {
          const result = CategoryModel(CategoryData);
          await prisma.category.createMany({ data: result });
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

async function seedProducts() {
  return new Promise((resolve, reject) => {
    console.log("seeding products");
    const productData = [];

    fs.createReadStream(productFile)
      .pipe(parse({ delimiter: ":" }))
      .on("data", (csvRow) => {
        productData.push(csvRow);
      })
      .on("end", async () => {
        try {
          const user = await prisma.user.findFirst({});
          if (!user) {
            throw new Error("No user found to associate with products.");
          }
          const result = ProductModel(productData, user.userId);
          await prisma.product.createMany({ data: result });
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}

async function seedUser() {
  console.log("seeding user 1(one)");

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

async function seedReviews() {
  return new Promise((resolve, reject) => {
    console.log("seeding reviews");
    var ReviewData = [];

    fs.createReadStream(reviewFile)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvRow) {
        ReviewData.push(csvRow);
      })
      .on("end", async () => {
        try {
          let result = ReviewModel(ReviewData);
          await prisma.review.createMany({ data: result });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function updateProductCategoryRelationship() {
  console.log("update product and category relationship");

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
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    await prisma.product.update({
      where: { productId: element.productId },
      data: { Category: { connect: element.connect } },
    });
  }
}

async function updateCategoryImage() {
  console.log("update category's image");

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
  const imageList = result
    .filter(
      ({ product }) => product.length > 0 && product[0].productImages.length > 0
    )
    .map((element) => {
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

async function seedCartItem() {
  console.log("update cart items");

  const cartItems = [];
  const products = await prisma.product.findMany({
    skip: 10,
    take: 5,
    select: { productId: true },
  });
  const userId = await prisma.user.findFirst({ select: { userId: true } });

  const cartRecordIds = [];
  for (let i = 0; i < products.length; i++) {
    const element = products[i];
    const quantity = parseInt(randomIntFromInterval(3, 10));
    try {
      const cartRecordId = await prisma.cartRecord.create({
        data: {
          recordProduct: { connect: { ...element } },
          quantity: quantity,
        },
        select: { recordId: true },
      });
      cartRecordIds.push(cartRecordId);
    } catch (error) {
      console.log(error);
    }
  }
  if (cartRecordIds.length != 0) {
    try {
      const cart = await prisma.cart.create({
        data: {
          user: { connect: { userId: userId.userId } },
          cartRecord: { connect: cartRecordIds },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// location before order in business logic
async function seedLocation() {
  console.log("Seeding location");

  const result = await prisma.location.create({
    data: { userId: 1, address: "141 West Glen home Ave.Bronx, NY 10473" },
  });
}

async function seedOrder() {
  console.log("//todo Seeding order");
  // problem if the cart also need quantity,
  // then there are 2 record as the same time
  //
  const testArray = [
    { productId: 1, quantity: 1 },
    { productId: 1, quantity: 1 },
    { productId: 1, quantity: 1 },
    { productId: 1, quantity: 1 },
  ];
  try {
    const result = await prisma.record.createMany({
      data: [{ recordProduct: { connect: { productId: 1 } }, quantity: 1 }],
    });
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  await seedUser();
  await seedCategories();
  await seedProducts();
  await updateProductCategoryRelationship();
  await updateCategoryImage();
  await seedReviews();
  await seedCartItem();
  await seedLocation();
}

// update both schema and prisma client:npx prisma migrate dev

// update schema: npx prisma db push
// update prisma client: npx prisma generate

module.exports.main = main;
