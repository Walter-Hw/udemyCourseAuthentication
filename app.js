require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session(
  {
    secret: 'My little secret cannot be leaked',
    resave: false,
    saveUninitialized: false
  }
));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route('/')
  .get((req, res) => {
    res.render('home');
  });

app.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, (err) => {
      if (err) {
        console.log('error occurs ===>', err);
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets');
        });
      }
    });
  });

app.route('/secrets')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render('secrets');
    } else {
      res.redirect('/login');
    }
  });

app.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
      if (err) {
        console.log('err occurs ===>', err);
        res.redirect('/register');
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets');
        });
      }
    });
  });

app.listen(port, () => {
  console.log('Start listening on port', port);
});