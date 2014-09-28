/* jshint node:true */

'use strict';

var bcrypt = require('bcrypt');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var middleware = exports;
exports.constructor = function middleware() {};

middleware.isAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
};
