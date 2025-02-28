const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};
module.exports.postUsers = async (req, res) => {
  res.send(req.body);
};
module.exports.putUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};
module.exports.deleteUsers = async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  res.send(user);
};
