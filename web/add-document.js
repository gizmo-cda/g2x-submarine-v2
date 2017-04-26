let MongoClient = require('mongodb').MongoClient,
	util = require('util');

// create sample connfiguration
let config = {
	"mongo": {
		"host": "localhost",
		"port": 27017,
		"db": "g2x"
	}
}
let mongo = config.mongo;

// build mongodb url
let url = util.format("mongodb://%s:%s/%s", mongo.host, mongo.port, mongo.db);

// connect to mongo server
MongoClient.connect(url, function(err, db) {
	console.log("Connected successfully to server");

	let values = db.collection("values");

	values.insertOne({
			time: new Date(),
			property: "temperature",
			value: 43.3
		},
		(err, result) => {
			console.log("Inserted documents into the collection");
		 	db.close();
		}
	);
});
