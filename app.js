const routes = require("./routes/index");
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/categories", routes.categoryRouter);
app.use("/products", routes.productRouter);
app.use("/search", routes.searchRouter);
app.use("/users", routes.userRouter);
app.use("/", routes.appRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
