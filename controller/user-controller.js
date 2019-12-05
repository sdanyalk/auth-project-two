const express = require("express");
const passport = require("passport");
const router = express.Router();
const db = require("../models");

// Passport
require("../config/passport")(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get("/users", function(req, res) {
  if (req.user) {
    db.user.findAll({}).then(function(data) {
      res.render("user", {
        users: data
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    db.user.findAll({ include: [db.history] }).then(function(data) {
      res.json(data);
    });
  }
);

router.get("/api/users/:id", function(req, res) {
  db.user
    .findAll({ where: { id: req.params.id }, include: [db.history] })
    .then(function(data) {
      res.json(data);
    });
});

router.post(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    db.user.create(req.body).then(function(data) {
      res.json(data);
    });
  }
);

router.delete(
  "/api/users/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    db.user.destroy({ where: { id: req.params.id } }).then(function(data) {
      res.json(data);
    });
  }
);

module.exports = router;
