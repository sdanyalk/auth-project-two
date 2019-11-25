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
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(email, password, cb) {
        db.user.findOne({ where: { email: email } }, function(err, data) {
          if (err) {
            return cb(err);
          }
          if (!data) {
            return cb(null, false);
          }
          if (data.password !== password) {
            return cb(null, false);
          }
          return cb(null, data);
        });
      }
    )
  );
};
