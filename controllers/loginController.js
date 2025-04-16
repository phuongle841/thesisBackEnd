const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
module.exports.login = async (req, res) => {
  // later put into controller

  const { userEmail, userPassword } = req.body;
  const user = { userEmail, userPassword };

  try {
    // this step need verify user
    // how? get the ideal but don't know implement
    const userId = await prisma.user.findUnique({
      where: { userEmail: userEmail },
      select: { userId: true },
    });

    jwt.sign({ user }, process.env.secretKey, (err, token) => {
      res.json({ token, userId });
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports.checkToken = async (req, res, next) => {
  jwt.verify(req.token, process.env.secretKey, (err, authData) => {
    // token is like the mock data put in the beginning
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ content: "this is the secret of the universe", authData });
    }
  });
};
