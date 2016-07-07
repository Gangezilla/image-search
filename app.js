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

var port = process.env.port || 8080;
app.listen(port, function() {
    console.log("Hi there, I'm listening on " + port + ".");
});

app.get("/", function(req, res) {
	res.send("<h1> Hello. Search? </h1>");
});

app.get('/:query', function(req, res) {
	memObject.query=req.params.query;
	memObject.time=new Date();
	mongoInsert(database, 'searches', memObject, function() {
		//console.log(res);
	});
	search.search(req.params.query, function(body) {
		//console.log(body.d.results[0].length);
		// for (var i=0; i<body.d.results.length;i++) {

		// }
		res.send(body.d.results);
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
//pagination
//3: figure out how to paginate through results (two ways, i guess. one is to save the results in a buffer and just show a fixed number then show more? but thats cheating. the other way would be to ping the server a second time, show what number reuslt we are up to atm, and then ask for the next batch? how we do this, who knows, but we can figure it out.


// User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

// User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

// User Story: I can get a list of the most recently submitted search strings. CHECK
