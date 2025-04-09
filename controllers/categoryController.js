const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const defaultPageNumber = 20;
const defaultSkip = 0;
const defaultTake = 10;

module.exports.getCategories = async (req, res) => {
  const { take, skip } = req.query;

  const categories = await prisma.category.findMany({
    skip: defaultSkip,
    take: defaultTake,
  });
  res.send(categories);
};

module.exports.getCategoriesById = async (req, res) => {
  const { categoryId } = req.params;
  const { take, skip } = req.query;

  const category = await prisma.category.findUnique({
    where: { categoryId: parseInt(categoryId) },
    include: {
      product: {
        take: take ? parseInt(take) : defaultTake,
        skip: skip ? parseInt(skip) : defaultSkip,
      },
    },
  });

  res.send(category);
};

module.exports.getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;
  const { take, skip } = req.query;
  const products = await prisma.category.findMany({
    where: { categoryId: parseInt(categoryId) },
    include: {
      product: {
        take: take ? parseInt(take) : defaultTake,
        skip: skip ? parseInt(skip) : defaultSkip,
      },
    },
  });
  res.send(products);
};

module.exports.postCategories = async (req, res) => {
  const { categoryTitle, categoryImage, categoryDescription } = req.body;

  const category = await prisma.category.create({
    data: {
      categoryTitle: categoryTitle,
      categoryImage: "",
      categoryDescription: categoryDescription,
    },
  });
  res.send(category);
};

module.exports.putCategories = async (req, res) => {
  const { categoryId } = req.params;
  const { data } = req.data;
  const category = await prisma.category.update({
    where: { categoryId: categoryId },
    data: { data },
  });
  res.send(category);
};

module.exports.deleteCategories = async (req, res) => {
  const { categoryId } = req.params;
  const category = await prisma.category.delete({
    where: { categoryId: categoryId },
  });
  res.send(category);
};
