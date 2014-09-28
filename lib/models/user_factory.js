/* jshint node:true */

'use strict';

var userFactory = exports;
exports.constructor = function userFactory() {};

var _ = require('lodash');
var scmp = require('scmp');
var squel = require('squel');
var pgPool = require('../utils/pgpool');

var UserModel = require('./user').User;

squel.useFlavour('postgres');

userFactory.create = function(data, cb) {
  var sql = squel.insert()
    .into('users')
    .set('username', data.username)
    .set('pwhash', data.pwhash)
    .returning('id, username, pwhash')
    .toParam();

  pgPool.query(sql, function(err, result) {
    if (err) {
      return cb(err);
    }

    if (result.rowCount !== 1) {
      return cb(new Error('failed to create user'));
    }

    var user = new UserModel(result.rows[0]);
    cb(null, user);
  });
};

userFactory.getUserById = function(id, cb) {
  if (!_.isString(id)) {
    throw new Error('id must be a number');
  }

  userFactory._getUserBy('id', id, cb);
};

userFactory.getUserByUsername = function(username, cb) {
  if (!_.isString(username)) {
    throw new Error('id must be a number');
  }

  userFactory._getUserBy('username', username, cb);
};

userFactory._getUserBy = function(prop, value, cb) {
  var sql = squel.select()
    .from('users')
    .field('id')
    .field('username')
    .field('pwhash')
    .where(prop + '= ?', value)
    .toParam();

  pgPool.query(sql, function(err, result) {
    if (err) {
      return cb(err);
    }

    if (result.rowCount === 0) {
      return cb(null, null);
    }

    var user = new UserModel(result.rows[0]);
    cb(null, user);
  });
};
