const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.searchDatabase = async (req, res) => {
  const { userid, userEmail, userName } = req.query;
  const { context } = req.query;

  const users = await prisma.user.findMany({
    where: { userName: { contains: context } },
  });
  res.send(users);
};
