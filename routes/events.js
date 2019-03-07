const express = require('express');
const enums = require('../libs/enums');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

/* GET event listing. */
router.get('/', function (req, res, next) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      let findQuery = { userId: foundUser._id };
      if ('mood' in req.query) {
        findQuery.mood = req.query.mood;
      }
      if ('date' in req.query) {
        findQuery.date = new Date(req.query.date);
        console.log(findQuery.date);
      }
      Event.find(findQuery, function (err, foundEvents) {
        res.json({ events: foundEvents });
      });
    }
  });
});

/* Create event */
router.post('/create', function (req, res) {
  if (!enums.isValidMood(req.body.mood)) {
    return res.status(400).json({ message: 'Invalid mood'});
  }
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      Event.findOne({ name: req.body.name, userId: foundUser._id }, {}, { sort: { 'date' : -1 } }, function (err, foundEvent) {
        const newScore = foundEvent ? foundEvent.score + 1 : 0
        const newEvent = new Event({
          name: req.body.name,
          desc: req.body.desc,
          mood: req.body.mood,
          date: new Date(req.body.date),
          score: newScore,
          userId: foundUser._id,
        });

        newEvent.save(function (err, event) {
          return res.json(event);
        });
      });
    }
  });
});

module.exports = router;
