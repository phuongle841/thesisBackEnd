const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const util = require("util");

module.exports.getLocation = async (req, res) => {
  const result = { location: "NewYork" };
  const { authData } = req;

  const user = await prisma.userCredentials.findUnique({
    where: { userEmail: authData.user.userEmail },
    select: { user: { select: { Location: true } } },
  });

  console.log(util.inspect(user, false, null, true /* enable colors */));

  res.json(result);
};
