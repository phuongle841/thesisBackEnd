const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getUsers = async (req, res) => {
  res.send({ message: "main branch app" });
};
