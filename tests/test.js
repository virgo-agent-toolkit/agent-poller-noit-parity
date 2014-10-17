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
    __dirname = '/var/log/stratcon.persist/127.0.0.1/noit-test/0/',
    CHECK_XML = '<?xml version="1.0" encoding="utf-8"?>' +
                '<check>' +
                '  <attributes>' +
                '    <name>test</name>' +
                '    <module>selfcheck</module>' +
                '    <target>127.0.0.1</target>' +
                '    <period>5000</period>' +
                '    <timeout>4000</timeout>' +
                '    <filterset>default</filterset>' +
                '  </attributes>' +
                '  <config>' +
                '    <code>200</code>' +
                '    <url>https://labs.omniti.com/</url>' +
                '  </config>' +
                '</check>',
    CHECK_ID = 'edc4760b-5bdb-45d6-ab82-34160eda8187';      

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

test('noit', function(t) {
  noit_client.setSerializedCheck(CHECK_ID, CHECK_XML, function(err) {
    t.error(err, "Set check should not error");
    t.end();
  });
});

test('test_check_test', function(t) {
  noit_client.testSerializedCheck(CHECK_ID, CHECK_XML, function(err, result) {
    t.error(err, "testCheck should not error");
    t.ok(result.hasOwnProperty('metrics'), "testCheck should return metrics");
    t.deepEqual(result.state, 'good', "testCheck should be of state good");
    t.end();
  });
});

test('getALL', function(t) {
  noit_client.getAllChecks(function(err, result) {
    t.error(err, "should not error");
    t.ok(result);
    t.end();
  });
});

test('get newly created check', function(t) {
  noit_client.getCheck(CHECK_ID,function(err, result) {
    t.error(err, "should not error");
    t.ok(result.indexOf(CHECK_ID) > -1);
    t.end();
  });
});

test('basic_ingestion', function(t) {
  async.series([
    function(callback) {
      setTimeout(callback, 50000); // Sleep for sometime to let the journals start ingesting
    },
    function(callback) {
      r_client = redis.createClient(6379, ip);
      r_client.on("connect", callback);
    },
    function(callback) {
    	redis.debug_mode = true;
      r_client.hgetall(CHECK_ID, function (err, data) {
        if (err) console.log('error', err);
        t.ok(data);
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
