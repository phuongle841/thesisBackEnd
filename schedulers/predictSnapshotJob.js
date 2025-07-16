const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cron = require("node-cron");
const ARIMA = require("arima");

const foreseeDates = 12; // Or whatever default range you want

const model = { p: 2, d: 1, q: 2, verbose: false };

// Schedule job: every day at 2:00 AM
cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Running snapshot prediction at 2AM");
  updateSnapShot();

  try {
  } catch (error) {
    console.error("❌ Snapshot failed:", error);
  }
});

async function updateSnapShot() {
  const userIds = await prisma.user.findMany({ select: { userId: true } });

  // for now just get the first user
  for (const { userId } of users) {
    const products = await fetchProductsWithOrders(userId);
    const forecasted = runForecast(products, model);
    await saveSnapshot(userId, forecasted);
  }

  console.log("✅ Snapshot saved successfully");
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
    await prisma.forecastSnapshot.create({
      data: {
        userId,
        productId: product.productId,
        predicted: product.expect, // may need JSON or separate table
        snapshotDate: new Date(),
      },
    });
  }
}
