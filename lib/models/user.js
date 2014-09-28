/* jshint node:true */

'use strict';

var user = exports;

var _ = require('lodash');
var scmp = require('scmp');
var pg = require('pg');

function User(data) {
  if (!data) {
    throw new Error('no data passed');
  }

  this._pwhash = data.pwhash;
  delete data.pwhash;

  this._data = data;
}

user.User = User;

User.prototype.getProperty = function(prop) {
  return this._data[prop];
};

User.prototype.getPwhash = function() {
  return this._pwhash;
};

User.prototype.toObject = function() {
  return this._data;
};
