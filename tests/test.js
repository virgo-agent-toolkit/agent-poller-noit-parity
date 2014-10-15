require('longjohn');
var ready = require('depends-on')(['postgres', 'noit_stratcon', 'redis', 'ingestor']);
var cleanup = require('depends-on')(['kill_postgres', 'kill_noit_stratcon', 'kill_ingestor',
  'kill_redis', 'remove_postgres', 'remove_noit','remove_redis', 'remove_ingestor']);
var test = require('tape');
var http = require('http');
var redis = require("redis");
var sleep = require("sleep");
var exec = require('child_process').exec;
var fs = require('fs');
var async = require('async');

var client = require('noit_client').NoitClient,
    child,
    r_client,
    noit_client,
    ip,
    __dirname = '/var/log/stratcon.persist/127.0.0.1/noit-test/0/';  

test('setup', ready);

test('init', function(t) {
  child = exec("boot2docker ip", function (error, stdout, stderr) {
    if (error !== null || stderr.indexOf('boot2docker') > -1) {
      ip = '127.0.0.1';
    } else {
      ip = stdout;
    }
    t.end();
  });
});

test('test noit', function(t) {
  noit_client = new client(ip, '8888');
  noit_client.getVersion(function(err, response) {
    if (response) {
      console.log("getNoitVersion Response: ", response)
    }
    t.ok(response);
    t.end();
  })
});

test('basic_ingestion', function(t) {
  async.series([
    function(callback) {
      setTimeout(callback, 20000); // Sleep for sometime to let the journals start ingesting
    },
    function(callback) {
      r_client = redis.createClient(6379, ip);
      r_client.on("connect", callback);
    },
    function(callback) {
      r_client.hgetall("f7cea020-f19d-11dd-85a6-cb6d3a2207dc", function (err, data) {
        if (err) console.log('error', err);
        t.ok(data);
        console.dir(data);
        r_client.end();
        t.end();
        callback;
      });
    }
  ], function(err) {
    if (err) console.log(err);
  });
});

test("teardown", cleanup);
