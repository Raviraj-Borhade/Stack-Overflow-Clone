const express = require("express");
const passport = require("passport");

const router = express.Router();

const Question = require("../models/Question");
const Profile = require("../models/Profile");
const Person = require("../models/Person");

// @type    post
//@route    /api/questions
// @desc    submiting questions
// @access  PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name,
    });
    newQuestion
      .save()
      .then((question) => {
        res.json(question);
      })
      .catch((e) => {
        console.log(`Error in saving question ${newQuestion}`, e);
      });
  }
);

// @type    get
//@route    /api/questions
// @desc  fetch all questions
// @access  PRIVATE
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then((questions) => {
      res.json(questions);
    })
    .catch((e) => {
      console.log(e);
    });
});
// @type    post
//@route    /api/questions/answers/:id
// @desc    submiting  answers to questions
// @access  PRIVATE

router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then((question) => {
        newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text,
        };
        question.answers.unshift(newAnswer);

        question.save().then((question) => {
          res.json(question);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
);
// @type    post
//@route    /api/questions/upvote/:id
// @desc    submiting upvote for question
// @access  PRIVATE

router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Question.findById(req.params.id)
          .then((question) => {
            const alreadyupvotedUser = question.upvote.filter((upvote) => {
              return upvote.user.toString() === req.user.id.toString();
            });
            if (alreadyupvotedUser.length > 0) {
              return res.status(400).json({ noupvote: "user already upvoted" });
            }

            question.upvote.unshift({ user: req.user.id });
            question
              .save()
              .then((question) => {
                res.json(question);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console, log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }
);

module.exports = router;
