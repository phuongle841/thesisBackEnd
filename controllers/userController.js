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
      where: { user: { userId: parseInt(userId) } },
      select: {
        cartId: true,
        cartRecord: {
          select: {
            recordId: true,
            quantity: true,
            recordProduct: true,
          },
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

  try {
    const { Cart } = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: { Cart: { select: { cartId: true } } },
    });

    const { cartRecord } = await prisma.cart.findUnique({
      where: { ...Cart },
      select: {
        cartRecord: {
          select: { recordId: true, ProductId: true, quantity: true },
        },
      },
    });

    const added = data.filter((element, index, array) => {
      const result = cartRecord.find((e, i, a) => {
        return e.ProductId == element.ProductId;
      });
      if (result == undefined) {
        return element;
      } else {
        return undefined;
      }
    });

    const changed = data.filter((element, index, array) => {
      const result = cartRecord.find((e, i, a) => {
        return e.ProductId == element.ProductId;
      });
      return result;
    });

    const removed = cartRecord.filter((element, index, array) => {
      const result = data.find((e, i, a) => {
        return e.ProductId == element.ProductId;
      });
      if (result == undefined) {
        return element;
      } else {
        return undefined;
      }
    });

    console.log("changed:\n", changed);
    console.log("added:\n", added);
    console.log("removed:\n", removed);

    // add => create new record
    // removed => remove connect
    // changed => update

    res.send({ message: "success to update" });
  } catch (error) {
    console.log(error);
    res.send("failed to update");
  }
};

module.exports.postUserOrder = async (req, res) => {
  res.json({ message: "posting order" });
};

module.exports.postUsers = async (req, res) => {
  const { userEmail, userName } = req.body;
  res.json(req.body);
};

module.exports.deleteUsers = async (req, res) => {
  const { userId } = req.params;
  const userExisted = await prisma.user.findUnique({
    where: { userId: parseInt(userId) },
  });
  if (userExisted) {
    return res.status("404").json({ error: "User already existed" });
  }
  res.json(user);
};
