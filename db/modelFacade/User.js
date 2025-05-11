const bcrypt = require("bcryptjs"); // same as in signup

// const hashedPassword = await bcrypt.hash("123456", 10);

module.exports.UserModel = (data) => {
  const result = data.map((person) => {
    const { userEmail, password, userName, userBackgroundUrl, userAvatarUrl } =
      person;

    const input = {
      userName,
      userBackgroundUrl,
      userAvatarUrl,
    };
    return input;
  });
  return result;
};
