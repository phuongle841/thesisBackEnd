const fs = require("fs");

const parse = require("csv-parser");

const path = require("path");
const trainFile = path.resolve(__dirname, "train.csv");

const ARIMA = require("arima");

async function test() {
  return new Promise((resolve, reject) => {
    let salesData = [];
    fs.createReadStream(trainFile)
      .pipe(parse({ delimiter: ":" }))
      .on("data", (csvRow) => {
        salesData.push(parseFloat(csvRow.number_sold));
      })
      .on("end", async () => {
        try {
          console.log(`Loaded ${salesData.length} records`);
          const testSize = 30; // Predict last 30 days
          const trainSeries = salesData.slice(0, -testSize);
          const testSeries = salesData.slice(-testSize);

          const arima = new ARIMA({ p: 2, d: 1, q: 2 }).train(trainSeries);
          const [forecast] = arima.predict(testSize);

          const mae = meanAbsoluteError(testSeries, forecast);
          const rmse = rootMeanSquaredError(testSeries, forecast);

          console.log(
            "Actual:",
            testSeries.map((n) => n.toFixed(2))
          );
          console.log(
            "Predicted:",
            forecast.map((n) => n.toFixed(2))
          );
          console.log(`MAE: ${mae.toFixed(2)}`);
          console.log(`RMSE: ${rmse.toFixed(2)}`);

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

// Error Metrics
function meanAbsoluteError(actual, predicted) {
  return (
    actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0) /
    actual.length
  );
}

function rootMeanSquaredError(actual, predicted) {
  return Math.sqrt(
    actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0) /
      actual.length
  );
}

async function main() {
  await test();
}
main();
