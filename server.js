const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Express and DB
const app = express();
const db = require('./config/db');
mongoose.Promise = global.Promise;
mongoose.connect(db);

// Helmet for secure HTTP headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com', 'use.fontawesome.com', "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:"],
    fontSrc: ["'self'", 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com', 'use.fontawesome.com'],
    frameSrc: ["'self'", 'www.facebook.com']
  }
}))

// Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
+app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(email, password, callback) {
  callback(null, email == process.env.ORV_USERNAME && password == process.env.ORV_PASSWORD);
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Auth
app.route('/login').get(function(req, res, next) {
  res.sendFile(path.join(__dirname, '/static/public', 'login.html'));
}).post(passport.authenticate('local', {
  failureRedirect: '/login?error',
  successRedirect: '/orv'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function auth(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}

// API
const api = require('./app/api');
app.use('/api', api);

// Static
app.use(express.static(__dirname + '/static/misc'));
app.use(express.static(__dirname + '/static/beta', { index: false }));
app.use(express.static(__dirname + '/static/public', { index: false }));
app.use('/orv', auth, express.static(__dirname + '/static/orv'));

app.use('/images', express.static(__dirname + '/static/images'), function(req, res, next) {
  res.status(404).end();
});

// Routes
app.get('/orv*', auth, function(req, res) {
  res.sendFile(path.join(__dirname, '/static/public', 'orv.html'));
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/beta', 'index.html'));
});

http.createServer(app).listen(5000, 'localhost');
