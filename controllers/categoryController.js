const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getCategories = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};
