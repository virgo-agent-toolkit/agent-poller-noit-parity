require('longjohn');
var ready = require('depends-on')(['postgres', 'noit_stratcon']);
var cleanup = require('depends-on')(['kill_postgres', 'kill_noit_stratcon', 'remove_postgres', 'remove_noit']);
var test = require('tape');
var http = require('http');
var client = require('noit_client').NoitClient;

test("dependencies", ready);

test('test noit', function(t) {
	var noit_client = new client('192.168.59.103', '8888', null, null, null);
	noit_client.getVersion(function(err, response){
	  if (response) {
	    console.log("getNoitVersion Response: ", response)
	  }
	  t.ok(response);
	  t.end();
  })
});

test('test journal', function(t) {
	http.get("http://192.168.59.103/handoff/journals", function(res) {
	  console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	t.end();
});  


test("dependencies", cleanup);
