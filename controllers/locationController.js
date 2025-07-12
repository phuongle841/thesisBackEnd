const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const util = require("util");

module.exports.getLocation = async (req, res, next) => {
  const { authData } = req;

  try {
    const location = await prisma.location.findMany({
      where: { user: { userId: authData.UserId } },
    });
    res.json(location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports.postLocation = async (req, res, next) => {
  const { authData } = req;
  const { data } = req.body;

  try {
    const location = await prisma.location.create({
      data: {},
    });
    res.json(location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports.putLocation = async (req, res, next) => {
  const { authData } = req;

  try {
    const { UserId } = await prisma.userCredentials.findUnique({
      where: { userEmail: authData.user.userEmail },
    });

    const location = await prisma.location.update({
      where: { user: { userId: UserId } },
      data: {},
    });

    res.json(location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports.deleteLocation = async (req, res, next) => {
  const { authData } = req;

  try {
    const { UserId } = await prisma.userCredentials.findUnique({
      where: { userEmail: authData.user.userEmail },
    });

    const location = await prisma.location.delete({
      where: { user: { userId: UserId } },
    });
    res.json(location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
