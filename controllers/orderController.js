const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({});
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.getOrder = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  try {
    const orders = await prisma.order.findMany({
      where: { UserId: userId },
      include: { Product: true },
      take: 20,
    });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.postOrders = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { data } = req.body;
  // try to find if the exact order have been made

  const orderRecords = data.map((e) => {
    console.log(e.quantity);
    return {
      UserId: userId,
      ProductId: e.recordProduct.productId,
      // 500 times quantify for charts
      quantity: e.quantity * 500,
    };
  });
  try {
    const order = await prisma.order.createMany({
      data: orderRecords,
    });

    res.json({ message: "order success" });
  } catch (error) {
    next(error);
  }
};
