const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getUsers = async (req, res) => {
  const { userid, userEmail, userName } = req.query;
  const users = await prisma.user.findMany();
  res.send(users);
};
module.exports.postUsers = async (req, res) => {
  const { userEmail, userName } = req.body;

  res.json(req.body);
};
module.exports.putUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};
module.exports.deleteUsers = async (req, res) => {
  const { userId } = req.params;
  const userExisted = await prisma.user.findUnique({
    where: { userId: parseInt(userId) },
  });
  if (userExisted) {
    return res.status("400").json({ error: "User already existed" });
  }
  res.json(user);
};
