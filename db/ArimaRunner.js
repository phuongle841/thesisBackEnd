const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const ARIMA = require("arima");
const testData = {
  arima: [
    100, 105, 102, 108, 112, 115, 117, 120, 118, 125, 130, 128, 132, 135, 140,
  ], // Slightly increasing trend
  sarima: [
    50, 60, 55, 65, 60, 70, 65, 75, 70, 80, 75, 85, 60, 70, 65, 75, 70, 80, 75,
    85, 80, 90, 85, 95,
  ], // Seasonal pattern every 12 points (e.g. monthly seasonality)
  auto: [5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 13, 14], // Simple, steady growth — good for auto-arima to determine parameters
  sarimax: [200, 198, 202, 204, 203, 207, 208, 210, 211, 209, 213, 215], // Mild pattern for test with external variables (exog would be added separately)
};
const models = {
  arima: { p: 2, d: 1, q: 2, verbose: false },
  sarima: { p: 2, d: 1, q: 2, P: 1, D: 0, Q: 1, s: 12, verbose: false },
  auto: { auto: true },
  sarimax: { p: 1, d: 0, q: 1, transpose: true, verbose: false },
};
async function testARIMA(array, model) {
  try {
    const arima = new ARIMA(model);
    const ts = array;
    arima.train(ts);
    const [pred] = arima.predict(3);
    console.log("Model: SARIMAX");
    console.log("Input Array:");
    console.log(array);
    console.log("Output predict for the next 3 variables:");
    pred.map((e, i) => console.log(i + 1, " ", e));
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  await testARIMA(testData.auto, models.auto);
}
main();
