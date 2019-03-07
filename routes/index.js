var express = require('express');
var router = express.Router();

const Day = require('../models/day');
const Event = require('../models/event');
const Profile = require('../models/profile');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

function dropSchema(schema, name='') {
  schema.remove({}, function(err) {
    console.log(err);
 });
}

router.post('/nuke', function (req, res) {
  if (req.body.code === 'kitty') {
    console.log('NUKING IT');

    // drop all collections
    for (schema of [Day, Event, Profile, User]) {
      dropSchema(schema);
    }
  }
});

module.exports = router;
