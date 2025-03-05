const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.send(categories);
};
module.exports.getCategoriesById = async (req, res) => {
  res.send("working");
};

module.exports.postCategories = async (req, res) => {
  res.send("working");
};

module.exports.putCategories = async (req, res) => {
  res.send("working");
};

module.exports.deleteCategories = async (req, res) => {
  res.send("working");
};
