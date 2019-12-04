const passport = require("passport");
const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../models");
const jwtSecret = require("../config/jwt-config");

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
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res) {
    const payload = {
      email: req.user.email,
      expires: Date.now() + parseInt(60000)
    };

    console.log(payload);

    req.login(payload, { session: false }, function(error) {
      if (error) {
        res.status(400).send({ error });
      }

      const token = jwt.sign(JSON.stringify(payload), jwtSecret.secret);

      res.cookie("jwt", token, { httpOnly: true, secure: true });
      res.redirect("/");
    });
  }
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
