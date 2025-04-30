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
  const { userId } = req.query;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
    });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.postOrder = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { data } = req.body;
  // try to find if the exact order have been made
  const orderRecords = data.map((e) => {
    return { ProductId: e.recordProduct.productId, quantity: e.quantity };
  });
  try {
    const order = await prisma.order.create({
      data: {
        owner: { connect: { userId: userId } },
        orderRecord: { create: orderRecords },
      },
    });

    res.json({ message: "order success" });
  } catch (error) {
    next(error);
  }
};
