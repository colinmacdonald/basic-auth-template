/* jshint node:true */

'use strict';

var passportConfig = exports;
exports.constructor = function passportConfig() {};

var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userFactory = require('../models/user_factory');

var LOGIN_FAILURE_MSG = 'incorrect username and/or password.';
var REGISTER_FAILURE_MSG = 'that email is already registered';
var SERVER_ERROR = 'something went wrong, please try again';

var opts = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
};

var localLogin = new LocalStrategy(
  opts,
  function(req, username, password, done) {
    userFactory.getUserByUsername(username, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: req.flash('loginFailed', LOGIN_FAILURE_MSG)
        });
      }

      bcrypt.compare(password, user.getPwhash(), function(err, res) {
        if (err) {
          return done(null, false, {
            message: req.flash('serverError', SERVER_ERROR)
          });
        }

        if (!res) {
          return done(null, false, {
            message: req.flash('loginFailed', LOGIN_FAILURE_MSG)
          });
        }

        return done(null, user);
      });
    });
  }
);

var localRegister = new LocalStrategy(
  opts,
  function(req, username, password, done) {
    userFactory.getUserByUsername(username, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false, {
          message: req.flash('registerFailed', REGISTER_FAILURE_MSG)
        });
      }

      bcrypt.hash(password, 8, function(err, hash) {
        if (err) {
          return done(null, false, {
            message: req.flash('registerFailed', REGISTER_FAILURE_MSG)
          });
        }

        user = {
          username: username,
          pwhash: hash
        };

        userFactory.create(user, function(cb, user) {
          if (err) {
            return done(err);
          }

          done(null, user);
        });
      });
    });
  }
);

passportConfig.set = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.getProperty('id'));
  });

  passport.deserializeUser(function(id, done) {
    userFactory.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('localLogin', localLogin);
  passport.use('localRegister', localRegister);
};
