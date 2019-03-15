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

  await createTestDay(testUser._id, '2019-03-06', 'NEUTRAL', 4546, 7, [
    { name: 'Did homework', mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Talked to Grandma', mood: 'HAPPY' },
    { name: 'Ran a mile', mood: 'NEUTRAL' },
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
  ]);
  await createTestDay(testUser._id, '2019-03-07', 'SAD', 3101, 5, [
    { name: 'Ate eggs and avocado', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Crammed homework', mood: 'SAD'},
    { name: 'Cried myself to sleep', mood: 'SAD' },
  ]);
  await createTestDay(testUser._id, '2019-03-08', 'NEUTRAL', 4976, 7, [
    { name: 'Ate oranges', mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'HAPPY' },
    { name: 'Talked to Grandma', mood: 'HAPPY'},
    { name: 'Ate medium rate steak', mood: 'SAD' }
  ]);
  await createTestDay(testUser._id, '2019-03-09', 'HAPPY', 8210, 10, [
    { name: 'Adopted a cat', mood: 'HAPPY' },
    { name: 'Played with cat', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Played some video games', mood: 'HAPPY' },
    { name: 'Ran a mile', mood: 'NEUTRAL' },
  ]);
  await createTestDay(testUser._id, '2019-03-10', 'HAPPY', 6809, 9, [
    { name: 'Took cat to vet', mood: 'NEUTRAL' },
    { name: 'Ate sushi', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Played with cat', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-11', 'NEUTRAL', 3546, 6, [
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
  ]);
  await createTestDay(testUser._id, '2019-03-12', 'NEUTRAL', 5586, 8, [
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Ran a mile', mood: 'NEUTRAL' },
    { name: 'Petted cat', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-13', 'HAPPY', 6112, 9, [
    { name: 'Adopted a new dog', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Played with cat', mood: 'HAPPY' },
    { name: 'Went to class', mood: 'NEUTRAL' },
  ]);
  await createTestDay(testUser._id, '2019-03-14', 'SAD', 2534, 6, [
    { name: 'Ate pancakes', mood: 'HAPPY' },
    { name: "Ate Wendy's", mood: 'SAD' },
    { name: 'Went to class', mood: 'SAD' },
    { name: 'Crammed homework', mood: 'SAD' },

  ]);
  await createTestDay(testUser._id, '2019-03-15', 'SAD', 2861, 4, [
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Talked to grandma', mood: 'NEUTRAL' },
    { name: 'Crammed homework', mood: 'SAD' },
  ]);
  await createTestDay(testUser._id, '2019-03-16', 'HAPPY', 8732, 9, [
    { name: 'Took a nap', mood: 'NEUTRAL' },
    { name: 'Ate Sushi', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Played with cat', mood: 'HAPPY' },
    { name: 'Ran a mile', mood: 'NEUTRAL' },
  ]);
  await createTestDay(testUser._id, '2019-03-17', 'HAPPY', 7320, 8, [
    { name: 'Ate oranges', mood: 'NEUTRAL' },
    { name: 'Cooked food', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
    { name: 'Watched movie', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-18', 'NEUTRAL', 5546, 6, [
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Did homework', mood: 'NEUTRAL' },
    { name: 'Talked to Grandma', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
  ]);
  await createTestDay(testUser._id, '2019-03-19', 'HAPPY', 7822, 7, [
    { name: "Ate Wendy's", mood: 'NEUTRAL' },
    { name: 'Went to class', mood: 'NEUTRAL' },
    { name: 'Talked to Grandma', mood: 'HAPPY' },
    { name: 'Ate Sushi', mood: 'HAPPY' },
    { name: 'Went for a run', mood: 'HAPPY' },
    { name: 'Petted cat', mood: 'HAPPY' },
  ]);
  return await recsys.generateContext(testUser._id);
}

module.exports = router;
