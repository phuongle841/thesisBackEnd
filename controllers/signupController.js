const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports.signup = async (req, res, next) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const { userId } = await prisma.user.create({
      data: {
        userName: username,
        UserCredentials: {
          create: { userEmail: email, password: hashedPassword },
        },
      },
      select: { userId: true, UserCredentials: true },
    });

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const location = await prisma.location.create({
      data: { userId, address: "" },
    });

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
