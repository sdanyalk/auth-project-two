const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/users", function(req, res) {
  db.user.findAll({ include: [db.history] }).then(function(data) {
    res.json(data);
  });
});

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
