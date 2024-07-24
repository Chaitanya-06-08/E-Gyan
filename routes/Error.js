const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.render("Error", {
    msg: "We are sorry, but the page you are looking for cannot be found.",
    user : req.session.user
  });
});

module.exports = router;
