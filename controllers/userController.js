const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getUsers = async (req, res) => {
  const { userId, userEmail, userName } = req.query;
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (error) {
    res.error(error);
  }
};

module.exports.getUserByToken = async (req, res, next) => {
  try {
    res.json({ userId: req.authData.UserId });
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: { userId: parseInt(userId) },
      include: { userReviews: true, Location: true },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Cannot find user" });
  }
};

module.exports.getUserCart = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const cart = await prisma.cart.findFirst({
      where: { user: { userId: parseInt(userId) } },
      select: {
        cartId: true,
        cartRecord: {
          select: {
            quantity: true,
            recordProduct: true,
          },
        },
      },
    });
    res.send(cart);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserOrders = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: { owner: { userId: parseInt(userId) } },
      orderBy: { orderId: "desc" },
    });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserReviews = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await prisma.review.findMany({
      where: { reviewerId: parseInt(userId) },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.putUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};

module.exports.putUserCart = async (req, res, next) => {
  const userId = req.params.userId;
  const { data } = req.body;

  try {
    const { Cart } = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: { Cart: { select: { cartId: true } } },
    });

    const { cartRecord } = await prisma.cart.findUnique({
      where: { ...Cart },
      select: {
        cartRecord: {
          select: { ProductId: true, quantity: true },
        },
      },
    });

    const added = data.filter(
      (element) =>
        !cartRecord.some(
          (item) => item.ProductId == element.recordProduct.productId
        )
    );

    const changed = data.filter((element) =>
      cartRecord.some(
        (item) => item.ProductId == element.recordProduct.productId
      )
    );

    const removed = cartRecord.filter(
      (element) =>
        !data.some((item) => item.recordProduct.productId == element.ProductId)
    );

    for (let i = 0; i < changed.length; i++) {
      const element = changed[i];
      const { recordProduct, quantity } = element;
      const { productId } = recordProduct;

      const CartId = Cart.cartId;

      const result = await prisma.cartRecord.update({
        where: {
          CartId_ProductId: {
            CartId: CartId,
            ProductId: recordProduct.productId,
          },
        },
        data: { quantity: parseInt(quantity) },
      });
    }

    for (let i = 0; i < added.length; i++) {
      const element = added[i];
      const { recordProduct, quantity } = element;

      const CartId = Cart.cartId;
      const result = await prisma.cartRecord.upsert({
        where: {
          CartId_ProductId: {
            CartId: CartId,
            ProductId: recordProduct.productId,
          },
        },
        update: { quantity },
        create: { CartId, ProductId: recordProduct.productId, quantity },
      });
    }

    for (let i = 0; i < removed.length; i++) {
      const element = removed[i];
      const { ProductId, quantity } = element;

      const CartId = Cart.cartId;
      const result = await prisma.cartRecord.delete({
        where: {
          CartId_ProductId: {
            CartId: CartId,
            ProductId: ProductId,
          },
        },
      });
    }

    res.send({ message: "success to update" });
  } catch (error) {
    next(error);
  }
};

module.exports.postUserOrder = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { data } = req.body;

  try {
    const orderRecords = data.map((e) => {
      return { ProductId: e.recordProduct.productId, quantity: e.quantity };
    });
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

module.exports.postUsers = async (req, res, next) => {
  const { user } = req.body;
  res.json(req.body);
};

module.exports.putUser = async (req, res, next) => {
  const { user } = req.body;
  const { UserId } = req.authData;

  const result = await prisma.user.update({
    where: { userId: UserId },
    data: user,
  });

  res.json(user);
};

module.exports.deleteUsers = async (req, res, next) => {
  const { userId } = req.params;
  const userExisted = await prisma.user.findUnique({
    where: { userId: parseInt(userId) },
  });
  if (userExisted) {
    return res.status(404).json({ error: "User already existed" });
  }
  res.json(user);
};
