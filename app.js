var express = require('express');
var app = new express();
mongodb=require('mongodb');

var search=require('./search');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI_IMAGE;

MongoClient.connect(url, function(err, db) {
    datab = db;
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the Mongo server.');
    }
});

var port = process.env.port || 8080;
app.listen(port, function() {
    console.log("Hi there, I'm listening on " + port + ".");
});

app.get("/", function(req, res) {
	res.send("<h1> Hello. Search? </h1>");
});

app.get('/:query', function(req, res) {
	//juuust make a new JSON object, with what you want in it?
	var results= [];
	search.search(req.params.query, function(body) {
		//results[i].mediaUrl +=(body.d.results[i].MediaUrl);
		for (var i=0; i<body.d.results.length;i++) {
			 results.push({
			 	ImageUrl: body.d.results[i].MediaUrl,
			 	SourceUrl: body.d.results[i].SourceUrl,
			 	Title: body.d.results[i].Title
			 });
		}
		res.send(results);
	});
});

//3: figure out how to paginate through results (two ways, i guess. one is to save the results in a buffer and just show a fixed number then show more? but thats cheating. the other way would be to ping the server a second time, show what number reuslt we are up to atm, and then ask for the next batch? how we do this, who knows, but we can figure it out.


// User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

// User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

// User Story: I can get a list of the most recently submitted search strings.
