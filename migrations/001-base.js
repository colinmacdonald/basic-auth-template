var db = require('../lib/utils/pgpool');

exports.up = function(next){
  var sql =
    'CREATE TABLE user_sessions(' +
      'sid varchar NOT NULL COLLATE "default", ' +
      'sess json NOT NULL, ' +
      'expire timestamp(6) NOT NULL' +
    ') ' +
    'WITH (OIDS=FALSE); ' +

    'ALTER TABLE user_sessions ' +
      'ADD CONSTRAINT "session_pkey" PRIMARY KEY(sid) ' +
      'NOT DEFERRABLE INITIALLY IMMEDIATE; ' +

    'CREATE TABLE users(' +
      'id bigserial primary key, ' +
      'username varchar(80) not null, ' +
      'pwhash varchar(256) not null ' +
    ');';

  db.query(sql, function(err) {
    if (err) {
      throw err;
    }

    next();
  });
};

exports.down = function(next) {
  var sql =
    'DROP TABLE user_sessions; ' +
    'DROP TABLE users;';

  db.query(sql, function(err) {
    if (err) {
      throw err;
    }

    next();
  });
};
