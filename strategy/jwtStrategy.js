const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Person = require("../models/Person");
const myKey = require("../setup/mydatabase");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

module.exports = (passport) => {
  console.log(JSON.stringify(opts));
  passport.use(
    new jwtStrategy(opts, (jwt_payload, done) => {
      Person.findById(jwt_payload.id)
        .then((person) => {
          if (person) {
            return done(null, person);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
};
