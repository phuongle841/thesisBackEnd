const routes = require("./routes/index");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/admin", routes.adminRouter);
app.use("/categories", routes.categoryRouter);
app.use("/location", routes.locationRouter);
app.use("/login", routes.loginRouter);
app.use("/products", routes.productRouter);
app.use("/search", routes.searchRouter);
app.use("/users", routes.userRouter);
app.use("/", routes.appRouter);
app.use((err, req, res, next) => {
  console.error(err);
  console.log("error is detect");

  res.status(500).send(err);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
