const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const defaultValues = { take: 10, skip: 0 };
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
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const take = parseInt(req.query.take, 10) || defaultValues.take;
  const skip = parseInt(req.query.skip, 10) || defaultValues.skip;

  try {
    const orders = await prisma.order.findMany({
      where: { UserId: userId },
      take,
      skip,
      orderBy: { orderId: "desc" },
      include: { Product: true },
    });
    const { _count } = await prisma.user.findUnique({
      where: { userId: userId },
      select: {
        _count: { select: { Order: true } },
      },
    });

    res.send({ orders: orders, count: _count });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};

module.exports.putOrder = async (req, res, next) => {
  const { data } = req.body;
  let { orderId, quantity } = req.body.data;

  orderId = parseInt(orderId);
  quantity = parseInt(quantity);

  try {
    const order = await prisma.order.update({
      where: { orderId },
      data: { quantity: quantity },
    });
    res.json(order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.postOrders = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { data } = req.body;
  // try to find if the exact order have been made

  const orderRecords = data.map((e) => {
    return {
      UserId: userId,
      ProductId: e.recordProduct.productId,
      quantity: parseInt(e.quantity),
    };
  });
  try {
    const order = await prisma.order.createMany({
      data: orderRecords,
    });

    const deletedCart = await prisma.cartRecord.deleteMany({
      where: { Cart: { user: { userId: userId } } },
    });
    res.json({ message: "order success" });
  } catch (error) {
    next(error);
  }
};
