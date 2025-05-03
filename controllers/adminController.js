const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ARIMA = require("arima");
const arimaModel = { p: 2, d: 1, q: 2, verbose: false };
const sarimaModel = {
  p: 2,
  d: 1,
  q: 2,
  P: 1,
  D: 0,
  Q: 1,
  s: 12,
  verbose: false,
};
const autoArima = { auto: true };
const sarimax = { p: 1, d: 0, q: 1, transpose: true, verbose: false };
const foreseeDates = 20;
const { randomIntFromInterval } = require("../utils/randomInterval");

module.exports.getProductData = async (req, res, next) => {
  const arima = new ARIMA(autoArima);
  try {
    const products = await prisma.product.findMany({
      where: { owner: { userId: 1 } },
      include: {
        order: { select: { quantity: true, orderDate: true } },
        Category: true,
      },
    });
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      const ts = element.order.map((e) => {
        return e.quantity;
      });
      arima.train(ts);
      const [pred, errors] = arima.predict(foreseeDates);
      products[index].expect = pred;
    }
    res.json(products);
  } catch (error) {
    next(error);
  }
};
module.exports.getOrders = async (req, res, next) => {
  const userId = parseInt(req, params.userId);
  try {
    const order = await prisma.order.findMany({ where: { owner: { userId } } });
    res.json(order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports.getFeedbacks = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  // userid = null since the front-end not yet set userid
  console.log(req.params);

  try {
    const feedbacks = await prisma.review.findMany({
      where: { product: { userId } },
      include: { product: true, reviewer: true },
    });

    res.json(feedbacks);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
