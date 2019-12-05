const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const jwtSecret = require("./jwt-config");
const db = require("../models");

module.exports = function(passport) {
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.user.findOne({ where: { id: id } }).then(function(data) {
      cb(null, data);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true
      },
      function(email, password, cb) {
        db.user.findOne({ where: { email: email } }).then(function(data) {
          if (data) {
            return cb(null, false, {
              message: "Oops! Email already signed-up."
            });
          } else {
            db.user
              .create({
                email: email,
                password: db.user.generateHash(password)
              })
              .then(function(data) {
                const record = {
                  status: "SignUp",
                  userId: data.dataValues.id
                };
                db.history.create(record).then(function() {
                  return cb(null, data);
                });
              });
          }
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
        session: false
      },
      function(email, password, cb) {
        console.log("Inside passport");
        console.log(email);
        console.log(password);
        console.log(cb);

        db.user.findOne({ where: { email: email } }).then(function(data) {
          if (!data) {
            return cb(null, false, { message: "No email found." });
          }
          if (!db.user.validPassword(password, data.password)) {
            return cb(null, false, { message: "Oops! Wrong password!" });
          }

          const record = {
            status: "LogIn",
            userId: data.id
          };
          db.history.create(record).then(function() {
            console.log(cb);

            return cb(null, data);
          });
        });
      }
    )
  );

  const opts = {
    jwtFromRequest: function(req) {
      console.log(req.cookies);

      return req.cookies.jwt;
    },
    secretOrKey: jwtSecret.secret
  };

  passport.use(
    "jwt",
    new JwtStrategy(opts, function(jwtpayload, cb) {
      console.log(jwtpayload);

      db.user.findOne({ id: jwtpayload.sub }).then(function(data) {
        if (data) {
          return cb(null, data);
        } else {
          return cb(null, false, { message: "No user found." });
        }
      });
    })
  );
};
