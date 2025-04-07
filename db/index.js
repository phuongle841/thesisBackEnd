const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const parse = require("csv-parser");

const { CategoryModel } = require("./modelFacade/Category");
const { ProductModel } = require("./modelFacade/Product");
const path = require("path");

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
      // await prisma.category.createMany({ data: result });
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
      let result = ProductModel(productData);
      console.log(result);

      // await prisma.product.createMany({ data: result });
    });
}

async function main() {
  // await seedCategories();
  await seedProducts();
}
module.exports.main = main;
