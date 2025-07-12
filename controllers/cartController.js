const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getCart = async (req, res, next) => {
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
