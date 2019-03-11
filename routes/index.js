var express = require('express');
var router = express.Router();

const Day = require('../models/day');
const Event = require('../models/event');
const Profile = require('../models/profile');
const User = require('../models/user');
const Health = require('../models/health');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/fill', function (req, res) {
  fill();
  res.json({ message: 'Fill received' });
});

router.post('/nuke', function (req, res) {
  console.log('NUKING IT');
  nuke();
  return res.json({ message: 'Nuke received' });
});

router.post('/fluke', async function (req, res) {
  await nuke();
  await fill();
  return res.json({ message: 'Fluke recieved' });
});

function makeUser(email, password, firstName, lastName) {
  return new User({
    email,
    password,
    firstName,
    lastName
  });
}

function makeProfile(mood, goal, userId) {
  return new Profile({
    mood,
    goal,
    userId
  })
}

function makeDay(mood, date, userId) {
  date = new Date(date);
  return new Day({
    mood,
    date,
    userId
  });
}

function makeHealth(date, steps, sleep, userId) {
  date = new Date(date);
  return new Health({
    date,
    info: {
      steps,
      sleep
    },
    userId
  })
}

function makeEvent(name, mood, date, score, userId) {
  date = new Date(date);
  return new Event({
    name,
    desc: '',
    mood,
    date,
    score,
    userId
  });
}

function createTestDay(userId, date, mood, steps, sleep, events) {
  makeDay(mood, date, userId).save();
  makeHealth(date, steps, sleep, userId).save();
  for (e of events) {
    makeEvent(e.name, e.mood, date, e.score ? e.score : 0, userId).save();
  }
  console.log(`Created day ${date}`);
}

async function dropSchema(schema, name='') {
  return schema.remove();
}

// drop all collections
async function nuke() {
  for (schema of [Day, Event, Profile, User]) {
    await dropSchema(schema);
  }
  return dropSchema(Health);
}

async function fill() {
  return makeUser('t@t.com', 'test', 'Firstname', 'Lastname')
    .save(function(err, testUser) {
      const userId = testUser._id;
      makeProfile('NEUTRAL', 'Becoming happier', userId).save();

      createTestDay(testUser._id, '03/06/19', 'NEUTRAL', 5546, 7, [
        { name: 'Ate pancakes', mood: 'HAPPY' },
        { name: 'Went to class', mood: 'NEUTRAL' },
        { name: 'Talked to John', mood: 'HAPPY' },
      ]);
      createTestDay(testUser._id, '03/07/19', 'NEUTRAL', 5102, 7, [
        { name: 'Ate eggs and avocado', mood: 'HAPPY' },
        { name: 'Went to class', mood: 'NEUTRAL' },
        { name: 'Talked to John', mood: 'HAPPY', score: 1},
        { name: 'Cried myself to sleep', mood: 'SAD' },
      ]);
      createTestDay(testUser._id, '03/08/19', 'NEUTRAL', 4976, 7, [
        { name: 'Ate oranges', mood: 'NEUTRAL' },
        { name: 'Went to class', mood: 'HAPPY' },
        { name: 'Talked to John', mood: 'HAPPY', score: 2},
        { name: 'Ate medium rate steak', mood: 'SAD' }
      ]);
      createTestDay(testUser._id, '03/09/19', 'SAD', 2546, 4, [
        { name: 'Going to the vet for Fido', mood: 'SAD' },
        { name: 'Journaled a little bit', mood: 'NEUTRAL' },
        { name: 'Played some video games', mood: 'HAPPY' },
        { name: 'Fido died', mood: 'SAD' }
      ]);
      createTestDay(testUser._id, '03/10/19', 'SAD', 1546, 6, [
        { name: 'Buried Fido', mood: 'SAD' },
        { name: 'Ran a mile', mood: 'HAPPY' },
      ]);
      createTestDay(testUser._id, '03/11/19', 'HAPPY', 3546, 10, [
        { name: 'Adopted a new dog', mood: 'HAPPY' },
        { name: 'Petted new puppy', mood: 'HAPPY' },
        { name: 'Went to class', mood: 'NEUTRAL' },
        { name: 'Ran a mile', mood: 'HAPPY' },
      ]);
    });
}

module.exports = router;
