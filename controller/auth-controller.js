const passport = require("passport");
const express = require("express");
const router = express.Router();

// Passport
require("../config/passport")(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get("/login", function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    failureRedirect: "/signup"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/", function(req, res) {
  res.render("index", {
    user: req.user
  });
});

router.get("*", function(req, res) {
  res.render("404");
});

module.exports = router;
