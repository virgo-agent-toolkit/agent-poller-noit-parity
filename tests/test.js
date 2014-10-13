require('longjohn');
var ready = require('depends-on')(['postgres', 'noit_stratcon']);
var cleanup = require('depends-on')(['kill_postgres', 'kill_noit_stratcon', 'remove_postgres', 'remove_noit']);
var test = require('tape');
var http = require('http');

var sys = require('sys');
var exec = require('child_process').exec;

var client = require('noit_client').NoitClient;
var child;
var ip;


test('setup', function (t) {
  child = exec("boot2docker ip", function (error, stdout, stderr) {
    ip = stdout;
    if (error !== null || stderr.indexOf('boot2docker') > -1) {
      ip = '127.0.0.1';
    }
    t.end();
  });
});


test("dependencies", ready);

test('test noit', function(t) {
  var noit_client = new client(ip, '8888');
  noit_client.getVersion(function(err, response) {
    if (response) {
      console.log("getNoitVersion Response: ", response)
    }
    t.ok(response);
    t.end();
  })
});

test('test journal', function(t) {
  http.get("http://" + ip + "/handoff/journals", function(res) {
    console.log("Got response: " + res.statusCode);
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
  t.end();
});  

test("dependencies", cleanup);
