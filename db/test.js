const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const parse = require("csv-parser");

const { randomIntFromInterval } = require("../utils/randomInterval");
const path = require("path");
const { ReviewModel } = require("./modelFacade/Review");

const prisma = new PrismaClient();
const reviewFile = path.resolve(__dirname, "./archive/fake_reviews.csv");

async function testFunction() {
  var ReviewData = [];

  fs.createReadStream(reviewFile)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvRow) {
      ReviewData.push(csvRow);
    })
    .on("end", async () => {
      let result = ReviewModel(ReviewData);
      await prisma.review.createMany({ data: result });
    });
}

async function main() {
  await testFunction();
}
main();
