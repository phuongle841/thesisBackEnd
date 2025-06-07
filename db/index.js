const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const util = require("util");
require("dotenv").config();

const parse = require("csv-parser");

const { CategoryModel } = require("./modelFacade/Category");
const { ProductModel } = require("./modelFacade/Product");
const path = require("path");
const { UserModel } = require("./modelFacade/User");
const { ReviewModel } = require("./modelFacade/Review");
const { randomIntFromInterval } = require("../utils/randomInterval");
const { OrderModel } = require("./modelFacade/Order");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const productFile = path.resolve(__dirname, "./archive/amazon_products.csv");
const CategoryFile = path.resolve(__dirname, "./archive/amazon_categories.csv");
const reviewFile = path.resolve(__dirname, "./archive/fake_reviews.csv");
const series = path.resolve(
  __dirname,
  "./archive/TimeSeriesPracticeDataset.csv"
);

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
          const result = ProductModel(productData);
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
  const userName = process.env.user;
  const password = process.env.password;
  const userBackgroundUrl = process.env.userBackgroundUrl;
  const userAvatarUrl = process.env.userAvatarUrl;
  let result = UserModel([
    {
      userEmail,
      password,
      userName,
      userBackgroundUrl,
      userAvatarUrl,
    },
  ]);
  const users = await prisma.user.createManyAndReturn({ data: result });
  // this is create
  const { userId } = users[0];
  const hashedPassword = await bcrypt.hash(password, 10);
  const credential = await prisma.userCredentials.create({
    data: {
      userEmail: userEmail,
      password: hashedPassword,
      user: { connect: { userId } },
    },
  });
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

async function updateOwnerProductRelationship() {
  try {
    const { userId } = await prisma.user.findFirst({});
    const updateProduct = await prisma.product.updateMany({
      where: { productPrice: { gte: 300 } },
      data: { userId },
    });
  } catch (error) {
    console.log(error);
  }
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

  const products = await prisma.product.findMany({
    skip: 10,
    take: 5,
    select: { productId: true },
  });

  const userId = await prisma.user.findFirst({ select: { userId: true } });
  // timeout since one user one cart

  try {
    const { cartId } = await prisma.cart.upsert({
      where: { ...userId },
      update: {},
      create: { ...userId },
    });
    const data = products.map((e) => {
      const CartId = cartId;
      const ProductId = e.productId;
      const quantity = randomIntFromInterval(3, 10);
      return { CartId, ProductId, quantity };
    });
    const result = await prisma.cartRecord.createMany({ data: data });
  } catch (error) {
    console.log(error);
  }
}

// location before order in business logic
async function seedLocation() {
  console.log("Seeding location");

  const result = await prisma.location.create({
    data: { userId: 1, address: "141 West Glen home Ave.Bronx, NY 10473" },
  });
}

async function seedInsaneAmountOfOrders() {
  return new Promise((resolve, reject) => {
    console.log("seeding series data");
    const orders = [];
    fs.createReadStream(series)
      .pipe(parse({ delimiter: ":" }))
      .on("data", (csvRow) => {
        orders.push(csvRow);
      })
      .on("end", async () => {
        try {
          const productIds = await prisma.product.findMany({
            where: { productPrice: { gte: 300 } },
            select: { productId: true },
          });
          const input = splitIntoChunks(orders, 50);
          const dates = getArrayOfDays().reverse();
          const result = OrderModel(input, dates, 1, productIds);
          for (let i = 0; i < result.length; i++) {
            const element = result[i];
            await prisma.order.create({
              data: element,
            });
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

function getArrayOfDays(count = 50) {
  const dates = [];
  const today = new Date();
  for (let i = 1; i < count + 1; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  return dates;
}
function splitIntoChunks(arr, chunkSize = 50) {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
}

async function seedOrder() {
  console.log("update order items");
  const products = await prisma.product.findMany({
    skip: 0,
    take: 5,
    select: { productId: true },
  });
  try {
    for (let i = 0; i < products.length; i++) {
      const element = products[i];
      const order = await prisma.order.create({
        data: {
          owner: { connect: { userId: 1 } },
          Product: { connect: { productId: element.productId } },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function testAuthenticate() {
  try {
    const userEmail = "ITITIU20281@student.hcmiu.edu.vn";
    const authenticate = await prisma.userCredentials.findUnique({
      where: { userEmail },
    });
    const user = await prisma.user.findMany({
      where: { UserCredentials: { is: { userEmail } } },
    });
    console.log(authenticate);
  } catch (error) {
    console.log(error);
  }
}
async function CategorizeData() {}

async function main() {
  // await seedUser();
  // await seedCategories();
  // await seedProducts();
  // await updateOwnerProductRelationship();
  // await updateProductCategoryRelationship();
  // await updateCategoryImage();
  // await seedReviews();
  // await seedCartItem();
  // await seedLocation();
  // await seedInsaneAmountOfOrders();
}

// update both schema and prisma client:npx prisma migrate dev

// update schema: npx prisma db push
// update prisma client: npx prisma generate

module.exports.main = main;
