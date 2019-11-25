const express = require("express");
const router = express.Router();
const db = require("../models");

module.exports = function(passport) {
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

  router.get("/user/:id", function(req, res) {
    db.user.findOne({ where: { id: req.params.id } }).then(function(data) {
      res.render("user", {
        example: data
      });
    });
  });

  router.get("*", function(req, res) {
    res.render("404");
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

  return router;
};
