const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

router.get("/login", (req, res, next) => {
  res.render("Login&SignUp/AuthTemplate", {
    authType: "Login",
    user: req.session.user,
  });
});

router.post("/login", (req, res, next) => {
  let email = req.body.loginEmail;
  let password = req.body.loginPassword;
  let type = req.body.userType;
  Users.fetchUsers().then((users) => {
    let userFoundOrNot = users.find((user) => {
      return (
        user.email === email && user.password === password && user.type === type
      );
    });
    if (userFoundOrNot) {
      req.session.loggedIn = true;
      req.session.user = userFoundOrNot;
      res.redirect("/");
    } else {
      res.render("Error", {
        msg: "Account does not exist",
        user: req.session.user,
      });
    }
  });
});

router.get("/signup", (req, res, next) => {
  res.render("Login&SignUp/AuthTemplate", {
    authType: "Signup",
    user: req.session.user,
  });
});

router.post("/signup", (req, res, next) => {
  let name = req.body.signupName;
  let email = req.body.signupEmail;
  let password = req.body.signupPassword;
  let type = "student";
  let user = new Users(name, email, password, type);
  Users.addUser(user);
  res.redirect("/login");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    console.log("session destroyed");
  });
  res.redirect("/login");
});
module.exports = router;
