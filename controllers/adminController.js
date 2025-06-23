const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { startOfDay } = require("date-fns");

const prisma = new PrismaClient();
const ARIMA = require("arima");

const take = 20;
const skip = 0;

const models = {
  arima: { p: 1, d: 0, q: 1, verbose: false },
  sarima: { p: 2, d: 1, q: 2, P: 1, D: 0, Q: 1, s: 12, verbose: false },
  auto: { auto: true },
  sarimax: { p: 1, d: 0, q: 1, transpose: true, verbose: false },
};

const foreseeDates = 3;

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
    const [pred] = arima.predict(forecastLength);
    return { ...product, expect: pred };
  });
}

module.exports.authenticate = async (req, res, next) => {
  const { userEmail, userPassword } = req.authData.user;
  try {
    const credentials = await prisma.userCredentials.findUnique({
      where: { userEmail },
      include: { user: true },
    });
    const { user } = credentials;

    if (!credentials)
      return res.status(401).json({
        error: "Invalid credentials, Cannot find credentials in database",
      });

    const match = await bcrypt.compare(userPassword, credentials.password);

    if (!match)
      return res
        .status(401)
        .json({ error: "Invalid credentials, Not matching credentials" });

    jwt.sign({ user }, process.env.secretKey, (err, token) => {
      res.json({ token, user });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getProductData = async (req, res, next) => {
  try {
    let products = await fetchProductsWithOrders(1);

    // 1. Combine same-day orders into one record per product
    products = products.map((product) => {
      const groupedOrders = {};

      product.order.forEach(({ quantity, orderDate }) => {
        const day = startOfDay(new Date(orderDate)).toISOString();

        if (!groupedOrders[day]) {
          groupedOrders[day] = 0;
        }
        groupedOrders[day] += quantity ?? 0;
      });

      // Turn the grouped object into sorted array
      const aggregatedOrders = Object.entries(groupedOrders)
        .map(([date, totalQuantity]) => ({
          orderDate: new Date(date),
          quantity: totalQuantity,
        }))
        .sort((a, b) => a.orderDate - b.orderDate);

      return { ...product, order: aggregatedOrders };
    });

    // 2. Find the longest order array (for filling gaps)
    let longestOrderArray = products.reduce((longest, product) => {
      return product.order.length > longest.length ? product.order : longest;
    }, []);
    let maxLength = longestOrderArray.length;

    // 3. Fill in missing dates with null quantity
    products = products.map((product) => {
      let order = [...product.order];

      // Fill in the gaps with matching dates
      while (order.length < maxLength) {
        const missingIndex = order.length;
        const dateFromLongest = longestOrderArray[missingIndex].orderDate;

        order.push({ orderDate: dateFromLongest, quantity: null });
      }

      return { ...product, order };
    });

    // 4. Run forecast
    const forecasted = runForecast(products, models["arima"]);
    console.log(forecasted[0]);

    res.json(forecasted);
  } catch (error) {
    next(error);
  }
};

const groupOrdersByProduct = (flatOrders) => {
  const grouped = {};

  for (const entry of flatOrders) {
    const { productId, orderDate, totalQuantity } = entry;

    if (!grouped[productId]) {
      grouped[productId] = [];
    }

    grouped[productId].push({
      orderDate,
      quantity: totalQuantity,
    });
  }

  return Object.entries(grouped).map(([productId, order]) => ({
    productId: Number(productId),
    order,
  }));
};

module.exports.putProductData = async (req, res, next) => {
  try {
    const { model, number } = req.body.data;
    const selectedModel = models[model?.toLowerCase()];

    if (!selectedModel) {
      throw new Error(`Unknown model type: ${model}`);
    }

    const products = await fetchProductsWithOrders(1);
    const forecasted = runForecast(
      products,
      selectedModel,
      number || foreseeDates
    );
    res.json(forecasted);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getInventory = async (req, res, next) => {
  const userId = parseInt(req.params?.userId);
  try {
    const products = await fetchProductsWithOrders(userId ? userId : 1);
    res.json(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  const userId = parseInt(req.params?.userId);
  const currentTake = parseInt(req.params?.take);

  try {
    const order = await prisma.order.findMany({
      where: { Product: { owner: { userId } } },
      take: currentTake ? currentTake : take,
      include: { Product: true },
    });
    res.json(order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports.putOrder = async (req, res, next) => {
  const { orderId, orderStatus, paid } = req.body.data;
  const updateData = {};
  if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
  if (paid !== undefined) updateData.paid = paid;

  try {
    const result = await prisma.order.update({
      where: { orderId: parseInt(orderId) },
      data: updateData,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getFeedbacks = async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  // userid = null since the front-end not yet set userid
  try {
    const feedbacks = await prisma.review.findMany({
      where: { product: { owner: { userId: userId } } },
      include: { product: true, reviewer: true },
    });
    res.json(feedbacks);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
