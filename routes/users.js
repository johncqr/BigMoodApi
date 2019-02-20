const express = require('express');
const router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find(function (err, allUsers) {
    res.json(allUsers);
  });
});

/* Create user */
router.post('/create', function (req, res) {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  newUser.save(function (err, user) {
    res.json(user);
  });
});

/* Log In user (no security) */
router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (foundUser && (foundUser.password === req.body.password)) {
      res.json(foundUser);
    } else {
      res.status(400).json({ message: "User does not exist or wrong password."});
    }
  });
});

module.exports = router;
