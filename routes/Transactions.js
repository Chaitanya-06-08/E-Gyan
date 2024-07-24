const express = require("express");
const router = express.Router();

const Books = require("../models/Books");

router.get("/displayTransactions", (req, res, next) => {
  Books.fetchTransactions().then((trans) => {
    res.render("Transactions/Transactions", {
      trans: trans,
      user: req.session.user,
    });
  });
});

router.get("/getTransactionsOfUser", (req, res, next) => {
  let userId = req.query.id;
  let type = req.query.type;
  Books.fetchTransactionsOfUser(userId, type).then((trans) => {
    res.render("Transactions/Transactions", {
      trans: trans,
      user: req.session.user,
    });
  });
});

module.exports = router;
