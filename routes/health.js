const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Health = require('../models/health');

/* GET health logs. */
router.get('/', function (req, res, next) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      let findQuery = { userId: foundUser._id };
      if ('date' in req.query) {
        findQuery.date = new Date(req.query.date);
      }
      Health.find(findQuery, function (err, foundLogs) {
        if (!foundLogs || err) {
          return res.json({});
        }
        res.json({ logs: foundLogs });
      });
    }
  });
});

/* Create health log */
router.post('/create', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      const newHealthLog = new Health({
        date: req.body.date,
        info: req.body.info,
        userId: foundUser._id
      });
      newHealthLog.save(function(err, healthLog) {
        return res.json(healthLog);
      });
    }
  });
});

module.exports = router;