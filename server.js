/* jshint node:true */

'use strict';

var http = require('http');

var express = require('express');
var helmet = require('helmet');
var passport = require('passport');

var configure = require('./lib/config/configure');

var PORT = process.env.PORT || 3000;

var app = express();

configure.all(app);

var server = http.createServer(app);

server.listen(PORT, function(err) {
  if (err) {
    throw err;
  }
  console.log('Basic Auth Server listening on port:', PORT);
});
