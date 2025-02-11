const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

let users = {
  1: {
    id: "1",
    username: "Robin Wieruch",
  },
  2: {
    id: "2",
    username: "Dave Davids",
  },
};

app.get("/users", (req, res) => {
  return res.send(users);
});

app.get("/", (req, res) => {
  return res.send("Received a GET HTTP method");
});

app.post("/", (req, res) => {
  return res.send("Received a POST HTTP method");
});

app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
