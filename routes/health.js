const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Day = require('../models/day');

/* Create health log */
router.post('/create', function (req, res) {
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