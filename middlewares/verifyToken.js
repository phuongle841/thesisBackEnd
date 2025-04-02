function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  //   check if bearer undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    // forbidden - 403
    res.sendStatus(403);
  }
}
module.exports = verifyToken;
