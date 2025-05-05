module.exports.UserCredentialModel = (data) => {
  const result = data.map((person) => {
    const { userEmail, password, userName } = person;
    const input = {
      userEmail,
      password,
    };
    return input;
  });
  return result;
};
