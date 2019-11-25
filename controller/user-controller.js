const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/user/:id", function(req, res) {
  db.user.findOne({ where: { id: req.params.id } }).then(function(data) {
    res.render("user", {
      example: data
    });
  });
});

router.get("/api/users", function(req, res) {
  db.user.findAll({}).then(function(data) {
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
