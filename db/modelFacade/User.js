module.exports.UserModel = (data) => {
  const result = data.map((person) => {
    const { userEmail, password, userName } = person;
    const input = {
      userEmail,
      password,
      userName,
    };
    return input;
  });
  return result;
};
