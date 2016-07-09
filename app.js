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
	res.send('<h1> Hello. Search? </h1> <p> This is a small tool to demonstrate an "image search abstraction layer" that acts as the sort of logic behind an image search. In the address bar up top, you can type in a query after the .com and you will see a list of images. You can paginate through these by adding "?offset=20" after your query. You can check out some other things that have been searched for by typing in  ');
});

app.get('/:query', function(req, res) {
	console.log(req.query.offset);
	var results= [];
	search.search(req.params.query, req.query.offset, function(body) {
		for (var i=0; i<body.d.results.length;i++) {
			 results.push({
			 	ImageUrl: body.d.results[i].MediaUrl,
			 	PageUrl: body.d.results[i].SourceUrl,
			 	Title: body.d.results[i].Title
			 });
		}
		res.send(results);
	});
});
