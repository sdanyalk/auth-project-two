const express = require("express");
const passport = require("passport");
const router = express.Router();
const db = require("../models");

// Passport
require("../config/passport")(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    console.log("inside /api/users");

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

router.post("/api/users", function(req, res) {
  db.user.create(req.body).then(function(data) {
    res.json(data);
  });
});

router.delete("/api/users/:id", function(req, res) {
  db.user.destroy({ where: { id: req.params.id } }).then(function(data) {
    res.json(data);
  });
});

module.exports = router;
