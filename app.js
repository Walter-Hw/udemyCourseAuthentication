const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { ID } = require('./config');
const { KEY } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(`mongodb+srv://${ID}:${KEY}@cluster0.zvnci.mongodb.net/userDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model('user', userSchema);


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {

  const newUser = new User({
    email: req.body.userName,
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });

});

app.listen(port, () => {
  console.log('Start listening on port', port);
});