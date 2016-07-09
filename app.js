var express = require('express');
var app = new express();
mongodb=require('mongodb');

var search=require('./search');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI_IMAGE;

var database;
var memObject = {
	"query": '',
	"time": ''
};

MongoClient.connect(url, function(err, db) {
    database = db;
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the Mongo server.');
    }
});

var port = process.env.port;
app.listen(port, function() {
    console.log("Hi there, I'm listening on " + port + ".");
});

app.get("/", function(req, res) {
	res.send('<h1> Hello. Search? </h1> <p> This is a small tool to demonstrate an "image search abstraction layer" that acts as the sort of logic behind an image search. In the address bar up top, you can type in a query after the .com and you will see a list of images. You can paginate through these by adding "?offset=20" after your query. For example ".com/test?offset=5" You can check out some other things that have been searched for by typing in "...com/api/latest". All code is up on GitHub at https://github.com/Gangezilla/image-search so feel free to check it out.</p>');
});

app.get('/:query', function(req, res) {
	memObject.query=req.params.query;
 	memObject.time=new Date();
 	mongoInsert(database, 'searches', memObject, function() {});
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

app.get('/api/latest', function(req,res) {
 	mongoFind(database, 'searches', function(err, data) {
 		if (err) throw err;
 		else {
 			res.send(data);
 		}
 	});
 });

 function mongoInsert(db, collection_name, data, cb) {
     var collection = db.collection(collection_name);
     collection.insert(data, function(err, res) {
         if (err) {
             console.log(err);
         } else {
             console.log('Inserted into the ' + collection_name + ' collection');
             cb(res);
         }
     });
 }

 function mongoFind(db, collection_name, cb) {
         console.log('Searching for link...');
         var collection = db.collection(collection_name);
         collection.find().limit(30).toArray(cb);
 }
