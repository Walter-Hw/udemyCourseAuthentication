require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model('user', userSchema);

app.route('/')
  .get((req, res) => {
    res.render('home');
  });

app.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username}, (err, results) => {
      if (err) {
        console.log('Error occurs ===>', err);
      } else {
        if (results) {
          bcrypt.compare(password, results.password, (err, result) => {
            if (result === true) {
              res.render('secrets');
            }
          });
        }
      }
    });

  });


app.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

      const newUser = new User({
        email: req.body.username,
        password: hash
      });

      newUser.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.render('secrets');
        }
      });
    });
  });

app.listen(port, () => {
  console.log('Start listening on port', port);
});