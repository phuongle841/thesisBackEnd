const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const ARIMA = require("arima");
const take = 20;
const skip = 0;

const models = {
  arima: { p: 2, d: 1, q: 2, verbose: false },
  sarima: { p: 2, d: 1, q: 2, P: 1, D: 0, Q: 1, s: 12, verbose: false },
  auto: { auto: true },
  sarimax: { p: 1, d: 0, q: 1, transpose: true, verbose: false },
};

const foreseeDates = 20;

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
    const products = await fetchProductsWithOrders(1);
    const forecasted = runForecast(products, models["arima"]);
    res.json(forecasted);
  } catch (error) {
    next(error);
  }
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
module.exports.getFeedbacks = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  // userid = null since the front-end not yet set userid

  try {
    const feedbacks = await prisma.review.findMany({
      include: { product: true, reviewer: true },
    });
    res.json(feedbacks);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
