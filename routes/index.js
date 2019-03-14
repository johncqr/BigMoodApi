var express = require('express');
var router = express.Router();
const recsys = require('../libs/recsys.js');

const Day = require('../models/day');
const Event = require('../models/event');
const EventMeta = require('../models/eventMeta');
const Profile = require('../models/profile');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/fill', function (req, res) {
  fill();
  res.json({ message: 'Fill received' });
});

router.post('/nuke', function (req, res) {
  nuke();
  return res.json({ message: 'Nuke received' });
});

router.post('/fluke', async function (req, res) {
  await nuke();
  await fill();
  return res.json({ message: 'Fluke recieved' });
});

async function createUser(email, password, firstName, lastName) {
  return await new User({
    email,
    password,
    firstName,
    lastName
  }).save();
}

async function createProfile(mood, goal, userId) {
  return await new Profile({
    mood,
    goal,
    userId,
    context: {}
  }).save();
}

async function createDay(mood, date, info, userId) {
  date = new Date(date);
  return await new Day({
    mood,
    date,
    userId,
    info,
  }).save();
}

async function createEventMeta(name, mood, userId) {
  const eventMeta = await EventMeta.findOne({ name, userId })
  if (!eventMeta) {
    const newEventMeta = EventMeta({
      name,
      happyScore: mood === 'HAPPY' ? 1 : 0,
      neutralScore: mood === 'NEUTRAL' ? 1 : 0,
      sadScore: mood === 'SAD' ? 1 : 0,
      userId
    })
    return await newEventMeta.save();
  } else {
    if (mood === 'HAPPY') {
      eventMeta.happyScore += 1
    } else if (mood === 'NEUTRAL') {
      eventMeta.sadScore += 1
    } else {
      eventMeta.neutralScore += 1
    }
    return await eventMeta.save()
  }
}

async function createEvent(userId, date, logs) {
  const newEvent = Event({
    userId,
    logs,
    date
  });
  return await newEvent.save();
}

async function createTestDay(userId, date, mood, steps, sleep, events) {
  const info = { steps, sleep };
  for (e of events) {
    await createEventMeta(e.name, e.mood, userId);
  }
  await createEvent(userId, date, events);
  console.log(`Created day ${date}`);
  return createDay(mood, date, info, userId);
}

async function dropSchema(schema, name='') {
  return await schema.remove();
}

// drop all collections
async function nuke() {
  for (schema of [Day, Event, Profile, EventMeta]) {
    await dropSchema(schema);
  }
  return await dropSchema(User);
}

async function fill() {
  const testUser = await createUser('t@t.com', 'test', 'Firstname', 'Lastname')
  const userId = testUser._id;
  await createProfile('NEUTRAL', 'Becoming happier', userId);

  await createTestDay(testUser._id, '2019-03-06', 'NEUTRAL', 5546, 7, [
    { name: 'Ate pancakes', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Talked to John', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-07', 'NEUTRAL', 5102, 7, [
    { name: 'Ate eggs and avocado', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Talked to John', mood: 'HAPPY'},
    { name: 'Cried myself to sleep', mood: 'SAD' },
  ]);
  await createTestDay(testUser._id, '2019-03-08', 'NEUTRAL', 4976, 7, [
    { name: 'Ate oranges', mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'HAPPY' },
    { name: 'Talked to John', mood: 'HAPPY'},
    { name: 'Ate medium rate steak', mood: 'SAD' }
  ]);
  await createTestDay(testUser._id, '2019-03-09', 'SAD', 2546, 4, [
    { name: 'Going to the vet for Fido', mood: 'SAD' },
    { name: 'Journaled a little bit', mood: 'NEUTRAL' },
    { name: 'Played some video games', mood: 'HAPPY' },
    { name: 'Fido died', mood: 'SAD' }
  ]);
  await createTestDay(testUser._id, '2019-03-10', 'SAD', 1546, 6, [
    { name: 'Buried Fido', mood: 'SAD' },
    { name: 'Ran a mile', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-11', 'HAPPY', 3546, 10, [
    { name: 'Adopted a new dog', mood: 'HAPPY' },
    { name: 'Petted new puppy', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Ran a mile', mood: 'HAPPY' },
  ]);
  return await recsys.generateContext(testUser._id);
}

module.exports = router;
