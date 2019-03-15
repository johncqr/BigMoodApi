const express = require('express');
const enums = require('../libs/enums');
const recsys = require('../libs/recsys');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');
const EventMeta = require('../models/eventMeta');

/* GET event listing. */
router.get('/', function (req, res, next) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      EventMeta.find({ userId: foundUser._id }, function (err, eventMetas) {
        if (!eventMetas || err) {
          return res.json({});
        }
        res.json({ events: eventMetas });
      });
    }
  });
});

/* GET ranked suggestions */
router.get('/suggestions', function (req, res, next) {
  User.findOne({ email: req.query.email }, function (err, foundUser) {
    if (!foundUser) {
      res.status(400).json({ message: 'Invalid user email' });
    } else {
      recsys.determineEventSuggestions(foundUser._id, 'HAPPY')
        .then(data => res.json(data));
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
      EventMeta.findOne({ name: req.body.name, userId: foundUser._id }, function (err, foundEventMeta) {
        if (!foundEventMeta) {
          return new EventMeta({
            name: req.body.name,
            happyScore: req.body.mood === 'HAPPY' ? 1 : 0,
            neutralScore: req.body.mood === 'NEUTRAL' ? 1 : 0,
            sadScore: req.body.mood === 'SAD' ? 1 : 0,
            userId: foundUser._id,
          }).save()
        } else {
          if (req.body.mood === 'HAPPY') {
            foundEventMeta.happyScore += 1
          } else if (req.body.mood === 'NEUTRAL') {
            foundEventMeta.sadScore += 1
          } else {
            foundEventMeta.neutralScore += 1
          }
          foundEventMeta.save()
        }
      });
      Event.findOne({ date: new Date(req.body.date), userId: foundUser._id }, function (err, foundEvent) {
        if (!foundEvent) {
          const newEvent = new Event({
            logs: [{ name: req.body.name, mood: req.body.mood }],
            date: new Date(req.body.date),
            userId: foundUser._id,
          });
          newEvent.save().then(e => res.json(e));
        } else {
          foundEvent.logs.push({ name: req.body.name, mood: req.body.mood })
          foundEvent.save().then(e => res.json(e));
        }
      });
    }
  });
});

module.exports = router;
