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
