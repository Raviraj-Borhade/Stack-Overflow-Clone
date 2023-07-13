const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

// const mongo = require("./setup/mydatabase").mongoURL;
const mongo =
  "mongodb+srv://RavirajB:Raviraj123@cluster0.mmvxfzi.mongodb.net/stack";
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const auth = require("./api/auth");
const profile = require("./api/profile");
const questions = require("./api/questions");

mongoose
  .connect(mongo)
  .then((result) => {
    console.log("connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

//passport middleware
app.use(passport.initialize());

//config jwt strategy
require("./strategy/jwtStrategy")(passport);

// app.get("/", (req, res) => {
//   res.send("welcome to stack overflow");
// });

//actual routes

app.use("/api/auth", auth);
app.use("/api/questions", questions);
app.use("/api/profile", profile);

app.listen(port, () => {
  console.log("connected succesfully");
});
