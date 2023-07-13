const express = require("express");

const router = express.Router();
const passport = require("passport");
const Profile = require("../models/Profile");
const Person = require("../models/Person");

// @type    GET
//@route    /api/profile/
// @desc    route for personnal user profile
// @access  PRIVATE

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "No profile Found" });
        }
        res.json(profile);
      })
      .catch((err) => console.log("got some error in profile " + err));
  }
);

// @type    POST
//@route    /api/profile/
// @desc    route UPDATING/SAVING profile
// @access  PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) {
      profileValues.username = req.body.username;
    }
    if (req.body.website) {
      profileValues.website = req.body.website;
    }
    if (req.body.portfolio) {
      profileValues.portfolio = req.body.portfolio;
    }
    if (req.body.country) {
      profileValues.country = req.body.country;
    }

    if (typeof req.body.languages !== undefined) {
      profileValues.languages = req.body.languages.split(",");
    }

    profileValues.social = {};

    if (req.body.youtube) {
      profileValues.social.youtube = req.body.youtube;
    }
    if (req.body.facebook) {
      profileValues.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
      profileValues.social.instagram = req.body.instagram;
    }

    //Do database stuff
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => console.log("problem in update" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then((profile) => {
              //Username already exists
              if (profile) {
                res.status(400).json({ username: "Username already exists" });
              }
              //save user
              new Profile(profileValues)
                .save()
                .then((profile) => res.json(profile))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log("Problem in fetching profile" + err));
  }
);

// @type    GET
//@route    /api/profile/:username
// @desc    route for getting user profile based on USERNAME
// @access  PUBLIC

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const username = req.params.username;

    Profile.findOne({ username: username })
      .populate("user", ["name", "profilepic"])
      .then((profile) => {
        if (!profile) {
          return res.json({ profileERR: "sorry we havent found any profile" });
        }
        res.status(200).json(profile);
      })
      .catch((e) => {
        res.json({ err: "having error in getting profile" });
      });
  }
);

// @type    GET
//@route    /api/profile/find/everyone
// @desc    route for getting user profile of EVERYONE
// @access  PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then((profiles) => {
      if (!profiles) {
        res.status(404).json({ usernotfound: "NO profile was found" });
      }
      res.json(profiles);
    })
    .catch((err) => console.log("Error in fetching username " + err));
});

// @type    post
//@route    /api/profile/workrole
// @desc    route for posting users workrole
// @access  PRIVATE

router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })

      .then((profile) => {
        const newWorkrole = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details,
        };

        profile.workrole.push(newWorkrole);
        profile
          .save()
          .then((profile) => {
            res.json(profile);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        res.json("error in saving workrole" + e);
      });
  }
);

// @type    delete
//@route    /api/profile/workrole/:roleID
// @desc    route for deleting users workrole
// @access  PRIVATE

router.delete(
  "/workrole/:roleID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const deletionID = req.params.roleID;
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const UpdatedWorkrole = profile.workrole.filter((role) => {
          return role._id != deletionID;
        });
        //console.log("Updated WorkRole", UpdatedWorkrole);

        profile.workrole = UpdatedWorkrole;
        profile
          .save()
          .then(() => {
            res.json(profile);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {});
  }
);
module.exports = router;
