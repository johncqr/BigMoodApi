const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Profile = require('../models/profile');
const Event = require('../models/event');

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find(function (err, allUsers) {
    res.json({ users: allUsers });
  });
});

/* Create user */
router.post('/create', function (req, res) {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  newUser.save(function (err, user) {
    if (err) {
      return res.json({ error: err });
    } else {
      return res.json(user);
    }
  });
});

/* Log In user (no security) */
router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (foundUser && (foundUser.password === req.body.password)) {
      res.json(foundUser);
    } else {
      res.status(400).json({ message: "User does not exist or wrong password."});
    }
  });
});

/* Onboard new user */
router.post('/onboard', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (foundUser) {
      for (ev of req.body.events.split(',')) {
        const newEvent = new Event({
          name: ev,
          mood: 'HAPPY',
          score: 0,
          userId: foundUser._id,
        });
        newEvent.save();
      }
      const newProfile = new Profile({
        mood: req.body.mood,
        goal: req.body.goal,
        userId: foundUser._id,
      })
      newProfile.save(function (err, profile) {
        return res.json(profile);
      });
    } else {
      res.status(400).json({ message: "User does not exist"});
    }
  });
});
module.exports = router;
