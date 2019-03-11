const express = require('express');
const enums = require('../libs/enums');
const router = express.Router();

const User = require('../models/user');
const Day = require('../models/day');
const Event = require('../models/event');
const Health = require('../models/health');

function generateMonthQueryProp(month, year) {
  month -= 1;
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
  return { '$gte': fromDate, '$lte': toDate };
}

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
      if ('month' in req.query && 'year' in req.query) {
        findQuery.date = generateMonthQueryProp(req.query.month, req.query.year);
      }
      Day.find(findQuery).sort({date: 1}).exec(function (err, foundDays) {
        res.json({ days: foundDays });
      });
    }
  });
});

/* Get day logs */
router.get('/log', function (req, res) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      let findQuery = { userId: foundUser._id, date: new Date(req.query.date) };
      Event.find(findQuery, function (error, foundEvents) {
        if (error) {
          return res.json({ error });
        }
        Health.findOne(findQuery, function (error, foundLog) {
          if (error) {
            return res.json({ error });
          }
          Day.findOne(findQuery, function (error, foundDay) {
            if (error) {
              return res.json({ error });
            }
            return res.json({
              mood: foundDay ? foundDay.mood : 'NONE',
              log: foundLog ? foundLog : { date: new Date(req.query.date), info: { sleep: 0, steps: 0 }},
              events: foundEvents ? foundEvents : []
            });
          })
        });
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
