const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(
  session({
    resave: false,
    secret: "thisisasecretkeydonottellanyone",
    saveUninitialized: false,
  })
);

const loginRoute = require("./routes/auth");
const homeRoute = require("./routes/Home");
const booksRoute = require("./routes/Books");
const transactionRoute = require("./routes/Transactions");
const errorRoute = require("./routes/Error");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

const homeDir = require("./util/homeDir");
app.use(express.static(path.join(homeDir, "public")));

app.use(loginRoute);
app.use(homeRoute);
app.use(booksRoute);
app.use(transactionRoute);
app.use(errorRoute);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
