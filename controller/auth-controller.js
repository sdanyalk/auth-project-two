const passport = require("passport");
const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const router = express.Router();
const db = require("../models");

// Flash
router.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "wootwoot"
  })
);
router.use(flash());

// Passport
require("../config/passport")(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get("/", function(req, res) {
  if (req.user) {
    res.render("index", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/login", function(req, res) {
  res.render("login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/signup", function(req, res) {
  res.render("signup", { message: req.flash("error") });
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

router.get("/logout", function(req, res) {
  const record = {
    status: "LogOut",
    userId: req.user.dataValues.id
  };
  db.history.create(record).then(function() {
    req.logout();
    res.redirect("/");
  });
});

// router.get("*", function(req, res) {
//   res.render("404");
// });

module.exports = router;
