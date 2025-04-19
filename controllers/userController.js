const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
module.exports.getUsers = async (req, res) => {
  const { userid, userEmail, userName } = req.query;
  const users = await prisma.user.findMany();
  res.send(users);
};

module.exports.getUserByToken = async (req, res, next) => {
  const { userEmail } = req.authData.user;
  try {
    const { userId } = await prisma.user.findUnique({
      where: { userEmail: userEmail },
      select: { userId: true },
    });
    res.json({ userId });
  } catch (error) {
    res.sendStatus(404);
    next(error);
  }
};

module.exports.postUsers = async (req, res) => {
  const { userEmail, userName } = req.body;
  res.json(req.body);
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findMany({
    where: { userId: parseInt(userId) },
  });
  if (user != null) {
    res.send("this is get user by id");
  } else res.status(400).json({ error: "Cannot find user" });
};

module.exports.getUserCart = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const cart = await prisma.cart.findFirst({
      where: { owner: { userId: parseInt(userId) } },
      select: {
        cartId: true,
        productList: {
          select: { productId: true, productName: true, productImages: true },
        },
      },
    });
    res.send(cart);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserOrders = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: { userReviews: true },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserReviews = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: { userReviews: true },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.putUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
};

module.exports.putUserCart = async (req, res, next) => {
  const userId = req.params.userId;
  const { data } = req.body;
  console.log(data);

  try {
    const { cartId, productList } = await prisma.cart.findFirst({
      select: {
        cartId: true,
        productList: { select: { productId: true } },
      },
    });
    const connectList = data.map((e) => {
      return { productId: e };
    });

    const result = await prisma.cart.update({
      where: { cartId: cartId },
      // just set and drop
      data: { productList: { set: connectList } },
    });
    res.send({ message: "success to update" });
  } catch (error) {
    console.log(error);
    res.send("failed to update");
  }
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
