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
const ARIMA = require("arima");

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
    where: { productId: { in: [10, 13, 30, 36, 88] } },
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
      const quantity = randomIntFromInterval(800, 900);
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
async function categorizeData() {
  console.log("what");

  try {
    const mostOrderedPerCategory = await prisma.$queryRaw`
  SELECT DISTINCT ON (ctp."A") 
       ctp."A" AS "categoryId", 
       p."productId", 
       COUNT(o."orderId") AS order_count
FROM "_CategoryToProduct" ctp
JOIN "Product" p ON p."productId" = ctp."B"
LEFT JOIN "Order" o ON o."ProductId" = p."productId"
GROUP BY ctp."A", p."productId"
ORDER BY ctp."A", order_count DESC;
`;

    const ARIMA = require("arima");
    const MSE = (a, b) =>
      a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0) / a.length;

    const products = await prisma.product.findMany({
      where: { owner: { userId: 1 } },
      include: {
        order: { select: { quantity: true, orderDate: true } },
        Category: true,
      },
      take: 1,
    });

    const orderData = products[0].order.map((e) => e.quantity);

    const candidates = [
      { p: 1, d: 0, q: 1 },
      { p: 1, d: 1, q: 1 },
      { p: 2, d: 1, q: 2 },
      { p: 3, d: 1, q: 1 },
      { p: 2, d: 0, q: 2 },
    ];

    let bestConfig = null;
    let lowestError = Infinity;

    for (const { p, d, q } of candidates) {
      try {
        const arima = new ARIMA({ p, d, q }).train(orderData);
        const [predictions] = arima.predict(orderData.length);

        const error = MSE(orderData, predictions);
        if (error < lowestError) {
          lowestError = error;
          bestConfig = { p, d, q };
        }
      } catch (err) {
        console.error(`Failed for p=${p}, d=${d}, q=${q}:`, err.message);
      }
    }

    console.log("Best ARIMA config:", bestConfig);
  } catch (error) {}
}

async function testRecordPredict(params) {
  const model = { auto: true, verbose: false };
  const foreseeDates = 5;

  try {
    const users = await prisma.user.findMany({ select: { userId: true } });

    // for now just get the first user
    for (const { userId } of users) {
      const products = await fetchProductsWithOrders(userId);
      const forecasted = runForecast(products, model);
      await saveSnapshot(userId, forecasted);
    }

    console.log("✅ Snapshot saved successfully");
  } catch (error) {
    console.error("❌ Snapshot failed:", error);
  }

  async function fetchProductsWithOrders(userId) {
    return prisma.product.findMany({
      where: { owner: { userId } },
      include: {
        order: { select: { quantity: true, orderDate: true } },
        Category: true,
      },
    });
  }

  function runForecast(products, modelConfig, forecastLength = foreseeDates) {
    const arima = new ARIMA(modelConfig);
    return products.map((product) => {
      const ts = product.order.map((e) => e.quantity);
      arima.train(ts);
      let [pred] = arima.predict(forecastLength);
      pred = pred.map((e) => Math.floor(e));
      return { ...product, expect: pred };
    });
  }

  async function saveSnapshot(userId, forecastedData) {
    for (const product of forecastedData) {
      await prisma.predictData.upsert({
        where: {
          ProductId: product.productId,
        },
        update: {
          predictedValues: product.expect,
        },
        create: {
          ProductId: product.productId,
          predictedValues: product.expect,
        },
      });
    }
  }
}

async function main() {
  await seedUser();
  await seedCategories();
  await seedProducts();
  await updateOwnerProductRelationship();
  await updateProductCategoryRelationship();
  await updateCategoryImage();
  await seedReviews();
  await seedCartItem();
  await seedLocation();
  await seedInsaneAmountOfOrders();
  await categorizeData();
  await testRecordPredict();
}

// update both schema and prisma client:npx prisma migrate dev

// update schema: npx prisma db push
// update prisma client: npx prisma generate

module.exports.main = main;
