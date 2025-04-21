const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getLocation = async (req, res) => {
  const result = { location: "NewYork" };
  const { authData } = req;
  const location = await prisma.location.findFirst({});

  res.json(result);
};
