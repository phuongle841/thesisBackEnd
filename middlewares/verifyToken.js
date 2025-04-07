const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  //   check if bearer undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    jwt.verify(token, process.env.secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    // forbidden - 403
    res.sendStatus(403);
  }
}
module.exports = verifyToken;
