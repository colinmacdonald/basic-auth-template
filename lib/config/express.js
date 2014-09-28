/* jshint node:true */

'use strict';

var expressConfig = exports;
exports.constructor = function expressConfig() {};

var path = require('path');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var connectPgSimple = require('connect-pg-simple');
var pg = require('pg');
var scmp = require('scmp');
var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var site = require('../routers/site');

var SessionStore = connectPgSimple(expressSession);

expressConfig.set = function(app) {
  app.set('views', __dirname + '/../../views');
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname, '/static')));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(expressSession({
    store: new SessionStore({
      pg: pg,
      conString: 'postgres://website:abc123@localhost:5432/voice_site',
      tableName: 'user_sessions'
    }),
    secret: 'keyboard cat',
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 Days
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(site.router());
};
