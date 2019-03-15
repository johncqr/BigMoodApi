const express = require('express');
const enums = require('../libs/enums');
const recsys = require('../libs/recsys');
const router = express.Router();

const User = require('../models/user');
const Day = require('../models/day');
const Event = require('../models/event');

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
      Day.find(findQuery).sort('date').exec(function (err, foundDays) {
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
      Event.findOne(findQuery, function (error, foundEvent) {
        if (error) {
          return res.json({ error });
        }
        Day.findOne(findQuery, function (error, foundDay) {
          if (error) {
            return res.json({ error });
          }
          let eventLogs = []
          if (foundEvent && foundEvent.logs) {
            eventLogs = foundEvent.logs.slice();
            for (let i = 0; i < eventLogs.length; ++i) {
              eventLogs._id = i;
            }
          }
          return res.json({
            mood: foundDay ? foundDay.mood : 'NONE',
            info: foundDay ? foundDay.info : { sleep: 0, steps: 0 },
            events: eventLogs
          });
        })
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
        info: req.body.info
      });

      newDay.save(function (err, day) {
        recsys.determineActivitySuggestions(foundUser._id, new Date(req.body.date).getDay(), req.body.info, req.body.mood).then(activitySuggestions => res.json({ day, activitySuggestions }));
      });
    }
  });
});

/* Updates health log for a day */
router.post('/health', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      const date = new Date(req.body.date);
      Day.findOneAndUpdate({ userId: foundUser._id, date },
        { info: req.body.info }, function (err, day) {
        return res.json(day);
      });
    }
  });
});

module.exports = router;
