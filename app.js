const routes = require("./routes/index");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// line printer should not be used in product
const lineDisplay = require("./utils/consoleHelper");
lineDisplay();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/admin", routes.adminRouter);
app.use("/cart", routes.cartRouter);
app.use("/categories", routes.categoryRouter);
app.use("/location", routes.locationRouter);
app.use("/login", routes.loginRouter);
app.use("/products", routes.productRouter);
app.use("/search", routes.searchRouter);
app.use("/orders", routes.orderRouter);
app.use("/review", routes.reviewRouter);
app.use("/users", routes.userRouter);
app.use("/", routes.appRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
