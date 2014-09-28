/*jshint node:true */

'use strict';

var pgpool = exports;
exports.constructor = function pgpool() {};

var  _ = require('lodash');
var pg = require('pg');

var connectUrl = 'postgres://website:abc123@localhost:5432/voice_site';

pgpool.query = function(sql, cb) {
  pg.connect(connectUrl, function(err, client, done) {
    if (err) {
      return done(err);
    }

    if (!_.isObject(sql)) {
      sql = {
        text: sql,
        values: null
      };
    }

    client.query(sql.text, sql.values, function(err, result) {
      done();

      if (err) {
        return cb(err);
      }

      cb(null, result);
    });
  });
};
