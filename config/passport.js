const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
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
        passwordField: "password"
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
        passwordField: "password"
      },
      function(email, password, cb) {
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
            return cb(null, data);
          });
        });
      }
    )
  );

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtSecret
  };

  passport.use(
    "jwt",
    // eslint-disable-next-line camelcase
    new JwtStrategy(opts, function(jwt_payload, cb) {
      console.log(jwt_payload);

      // eslint-disable-next-line camelcase
      db.user.findOne({ id: jwt_payload.sub }).then(function(data) {
        if (data) {
          return cb(null, data);
        } else {
          return cb(null, false, { message: "No user found." });
        }
      });
    })
  );
};
