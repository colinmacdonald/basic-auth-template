/* jshint node:true */

'use strict';

var http = require('http');

var express = require('express');
var config = require('env-json');

var configure = require('./lib/config/configure');

config.initialize('basicAuthTemplate');
config.set('port', process.env.PORT || 3000);

var app = express();

configure.all(app);

var server = http.createServer(app);

server.listen(config.port, function(err) {
  if (err) {
    throw err;
  }
  console.log('Basic Auth Server listening on port:', config.port);
});
