/* jshint node:true */

'use strict';

var configure = exports;
exports.constructor = function configure() {};

var expressConfig = require('./express');
var passportConfig = require('./passport');

configure.all = function(app) {
  passportConfig.set();
  expressConfig.set(app);
};
