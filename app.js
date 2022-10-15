const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

// var usersRouter = require("./routes/users/index");
// var transactionTypesRouter = require("./routes/transactionTypes/index");
// var transactionRouter = require("./routes/transactions/index");
// var rolesRouter = require("./routes/roles/index");
// var productTypesRouter = require("./routes/productTypes/index");
// var productRouter = require("./routes/products/index");
// var currenciesRouter = require("./routes/currencies/index");
// var indexRouter = require("./routes/index");

const usersRouter = require("./routes/users-routes");
const transactionTypesRouter = require("./routes/transactionTypes-routes");
const transactionRouter = require("./routes/transaction-routes");
const rolesRouter = require("./routes/roles-routes");
const productTypesRouter = require("./routes/productTypes-routes");
const productRouter = require("./routes/products-routes");
const currenciesRouter = require("./routes/currencies-routes");
const loginRouter = require("./routes/login-routes");

const { authenticateToken } = require("./controllers/login-controller");

const app = express();
dotenv.config();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/transactionTypes", authenticateToken, transactionTypesRouter);
app.use("/transactions", authenticateToken, transactionRouter);
app.use("/roles", authenticateToken, rolesRouter);
app.use("/productTypes", authenticateToken, productTypesRouter);
app.use("/products", authenticateToken, productRouter);
app.use("/currencies", authenticateToken, currenciesRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("Result: " + req.app.get("env"));
  res.status(err.status || 500);
  res.send({
    type: "error",
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const port = process.env.PORT;
console.log(`Running on port: ${port}`);

module.exports = app;
