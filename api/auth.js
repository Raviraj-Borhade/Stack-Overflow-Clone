const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { default: mongoose } = require("mongoose");
const key = require("../setup/mydatabase");

const router = express.Router();

const Person = require("../models/Person");
//route for testing

// router.get("/", (req, res) => {
//   res.json({ test: "auth is sucess" });
// });

// type  post
//@route /api/auth/register
//desc   for registration of user
//access  PUBLIC

router.post("/register", (req, res) => {
  console.log("in register");
  Person.findOne({ email: req.body.email })
    .then((person) => {
      console.log(person);
      if (person) {
        res.status(400).json({ emailError: "email already exist " });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }

            newPerson.password = hash;
            newPerson
              .save()
              .then((result) => {
                console.log("registration successfull");
              })
              .catch((e) => {
                console.log(e);
              });
          });
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
// type  post
//@route /api/auth/login
//desc   for login of user
//access  PUBLIC

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email: email })
    .then((person) => {
      if (!person) {
        return res
          .status(404)
          .json({ emailErr: "no user found with such email" });
      }

      bcrypt
        .compare(password, person.password)
        .then((isMatch) => {
          if (isMatch) {
            /*res.json({ sucess: "user is able to login successfully" });*/
            // use Payload and create token for user
            const Payload = {
              id: person.id,
              name: person.name,
              email: person.email,
            };
            jwt.sign(Payload, key.secret, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            });
          } else {
            res.status(400).json({ passwordERR: "password is not correct" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {});
});

// type  GET
//@route /api/auth/profile
//desc   for registration of user
//access  PRIVATE

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  console.log(req);

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic,
    });
  }
);

module.exports = router;
