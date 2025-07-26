const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const ARIMA = require("arima");
const model = { auto: true, verbose: false };
const foreseeDates = 5;

module.exports.updateSnapShot = async () => {
  try {
    const users = await prisma.user.findMany({ select: { userId: true } });

    // for now just get the first user
    for (const { userId } of users) {
      const products = await fetchProductsWithOrders(userId);
      const forecasted = await runForecast(products, model);
      await saveSnapshot(userId, forecasted);
    }

    console.log("✅ Snapshot saved successfully");
  } catch (error) {
    console.error("❌ Snapshot failed:", error);
  }
};

async function fetchProductsWithOrders(userId) {
  return prisma.product.findMany({
    where: { owner: { userId } },
    include: {
      order: { select: { quantity: true, orderDate: true } },
      Category: true,
    },
  });
}

async function runForecast(
  products,
  modelConfig,
  forecastLength = foreseeDates
) {
  return products.map((product) => {
    const arima = new ARIMA(modelConfig);
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
// updateSnapShot();
