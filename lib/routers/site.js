/* jshint node:true */

'use strict';

var site = exports;
exports.constructor = function site() {};

var express = require('express');
var passport = require('passport');

var middleware = require('./middleware');

site.router = function() {
  var router = new express.Router();

  router.get(
    '/login',
    site._login
  );

  router.get(
    '/register',
    site._register
  );

  router.post(
    '/auth/login/basic',
    passport.authenticate('localLogin', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  router.post(
    '/auth/register/basic',
    passport.authenticate('localRegister', {
      successRedirect: '/dashboard',
      failureRedirect: '/register',
      failureFlash: true
    })
  );

  router.get(
    '/dashboard',
    middleware.isAuthenticated,
    site._dashboard
  );

  return router;
};

site._login = function(req, res) {
  if (!req.user) {
    return res.render('login', {
      error: req.flash('loginFailed')
    });
  }

  res.redirect('/dashboard');
};

site._register = function(req, res) {
  if (!req.user) {
    return res.render('register', {
      error: req.flash('registerFailed')
    });
  }

  res.redirect('/dashboard');
};

site._dashboard = function(req, res) {
  res.render('dashboard', req.user);
};

site._logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};
