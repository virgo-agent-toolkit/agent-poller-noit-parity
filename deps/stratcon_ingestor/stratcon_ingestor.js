var fs = require('fs');
var http = require("http");
var redis = require("redis");
var r_client = redis.createClient(6379, 'redis', {});

var options = {
  hostname: 'noit',
  port: 80,
  path: '/handoff/journals',
  method: 'GET'
};

var buf,
    file,
    lines,
    fields,
    data,  
    __dirname = '/var/log/stratcon.persist/127.0.0.1/noit-test/0/';


var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
    if (chunk.indexOf('.h') > -1) {
      file = chunk.split(":")[1].split("/")[7].replace('\r\n','');
      fs.readFile(__dirname + file, function (err, content) {
        if (err) {
          console.log(err);
        }
        console.log('CONTENT \n' + content);
        lines = content.toString().split("\n");
        fields = content.toString().split("\n")[0].split("\t");
        data = fields[7];
        lines.forEach(function(line) {
          if (line.charAt(0) == 'B') {
            if (line.charAt(1) == '1') {
              console.log('Check UUID', fields[2]);
              console.log(fields[6]);
              buf = new Buffer(line, 'base64');
              console.log("data", buf);
              r_client.hset(fields[2], "timestamp", fields[1], redis.print);
              r_client.hset(fields[2], "data", buf, redis.print);
            } else if (line.charAt(1) != '2') {
              console.log('Unable to process line: Bad version');
            }
          }  
        });
      });
    };
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
