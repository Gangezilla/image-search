var express = require('express');
var app = new express();
var bingCode = process.env.bingCode;


var Bing = require('node-bing-api')({ accKey: bingCode });
console.log(bingCode);

var port = process.env.port || 8080;
app.listen(port, function() {
    console.log("Hi there, I'm listening on " + port + ".");
});

Bing.web("stack overflow", function(error, res, body){
    console.log(body);
  },
  {
    top: 50,
    market: 'en-US'
  });


//1: get connection to external search engine/site. okay, bing has an api (Bing Search API on microsoft azure), so does google (Google Custom Search). CHECK
//2: take search parameter from up in URL
//3: figure out how to paginate through results (two ways, i guess. one is to save the results in a buffer and just show a fixed number then show more? but thats cheating. the other way would be to ping the server a second time, show what number reuslt we are up to atm, and then ask for the next batch? how we do this, who knows, but we can figure it out.
