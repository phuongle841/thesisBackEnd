const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

module.exports.signup = async (req, res, next) => {
  const { email, password, username } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        userName: username,
        UserCredentials: {
          create: { userEmail: email, password: hashedPassword },
        },
      },
      include: { UserCredentials: true },
    });
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  // later put into controller
  const { userEmail, userPassword } = req.body;
  const user = { userEmail, userPassword };

  try {
    // this step need verify user
    // how? get the ideal but don't know implement
    const credentials = await prisma.userCredentials.findUnique({
      where: { userEmail },
      include: { user: true },
    });

    if (!credentials)
      return res.status(401).json({
        error: "Invalid credentials, Cannot find credentials in database",
      });

    const match = await bcrypt.compare(userPassword, credentials.password);

    if (!match)
      return res
        .status(401)
        .json({ error: "Invalid credentials, Not matching credentials" });

    jwt.sign({ user }, process.env.secretKey, (err, token) => {
      res.json({ token, credentials });
    });
  } catch (error) {
    console.log(error);
    next(error);
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
