const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

module.exports = function(passport) {
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.user.findOne(id, function(err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, cb) {
        db.user
          .create({
            email: email,
            password: db.user.generateHash(password)
          })
          .then(function(data) {
            return cb(null, data);
          });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, cb) {
        db.user.findOne({ where: { email: email } }).then(function(data) {
          if (!data) {
            return cb(null, false);
          }
          if (!db.user.validPassword(password, data.password)) {
            return cb(null, false);
          }
          return cb(null, data);
        });
      }
    )
  );
};
