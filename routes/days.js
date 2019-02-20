const express = require('express');
const enums = require('../libs/enums');
const router = express.Router();

const User = require('../models/user');
const Day = require('../models/day');

/* GET day listing. */
router.get('/', function (req, res, next) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      let findQuery = { userId: foundUser._id };
      if ('mood' in req.query) {
        findQuery.mood = req.query.mood;
      }
      Day.find(findQuery, function (err, foundDays) {
        res.json({ days: foundDays });
      });
    }
  });
});

/* Create day */
router.post('/create', function (req, res) {
  if (!enums.isValidMood(req.body.mood)) {
    return res.status(400).json({ message: 'Invalid mood'});
  }
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      const newDay = new Day({
        mood: req.body.mood,
        date: new Date(req.body.date),
        userId: foundUser._id,
      });

      newDay.save(function (err, day) {
        res.json(day);
      });
    }
  });
});

module.exports = router;
