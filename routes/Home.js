const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  let user = req.session.user;
  res.render("Home/Home", {
    path: user ? user.type : null,
    user: user,
  });
});

module.exports = router;
