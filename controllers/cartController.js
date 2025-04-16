const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getCart = async (req, res, next) => {
  const { authData } = req;
  const { userEmail } = authData.user;
  try {
    const result = await prisma.user.findUnique({
      where: { userEmail: userEmail },
      select: { Product: { take: 2 } },
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
};
