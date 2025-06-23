const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const util = require("util");

module.exports.getLocation = async (req, res, next) => {
  const { authData } = req;

  try {
    const { UserId } = await prisma.userCredentials.findUnique({
      where: { userEmail: authData.user.userEmail },
    });

    const location = await prisma.location.findMany({
      where: { user: { userId: UserId } },
    });
    res.json(location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
