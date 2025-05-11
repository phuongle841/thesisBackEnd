const signupRouter = require("./signupRouter");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", signupRouter);
app.get("/", (req, res, next) => {
  res.json({ message: "error " });
});

test("index route works", (done) => {
  request(app)
    .post("/")
    .type("form")
    .send({
      username: process.env.user,
      email: process.env.userEmail,
      password: process.env.password,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      console.log(res);

      if (err) return done(err);
      return done();
    });
});

describe("Post user", function () {
  it("responds with json", function () {
    return request(app)
      .post("/")
      .type("form")
      .send({
        username: process.env.user,
        email: process.env.userEmail,
        password: process.env.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log(response);

        expect(response.body.email).toEqual(undefined);
      });
  });
});
