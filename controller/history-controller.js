const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/histories", function(req, res) {
  db.history.findAll({ include: [db.user] }).then(function(data) {
    res.json(data);
  });
});

router.get("/api/histories/:id", function(req, res) {
  db.history
    .findAll({ where: { id: req.params.id }, include: [db.user] })
    .then(function(data) {
      res.json(data);
    });
});

router.post("/api/histories", function(req, res) {
  db.history.create(req.body).then(function(data) {
    res.json(data);
  });
});

router.delete("/api/histories/:id", function(req, res) {
  db.history.destroy({ where: { id: req.params.id } }).then(function(data) {
    res.json(data);
  });
});

module.exports = router;
