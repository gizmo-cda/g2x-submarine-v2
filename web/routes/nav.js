let async = require('async');

let defaultProperties = { "_id": true };
let gpsProperties = { "_id": true, "timestamp": true };

function lastDocument(db, collectionName, callback) {
	let collection = db.collection(collectionName);

	collection.count((err, count) => {
		collection.find({}).skip(count - 1).toArray(callback);
	})
}

function stripProperties(object, properties) {
	var result = {};

	for (p in object) {
		if (p in properties === false) {
			result[p] = object[p];
		}
	}

	return result;
}

module.exports = function(app) {
	app.get('/nav', (req, res, next) => {
		let db = app.get('db');
		let accelerometer = db.collection('accelerometer');
		let gyroscope = db.collection('gyroscope');
		let compass = db.collection('compass');
		let temperature = db.collection('temperature');

		async.parallel({
			"orientation": (done) => {
				lastDocument(db, "orientation", done)
			},
			"accelerometer": (done) => {
				lastDocument(db, "accelerometer", done)
			},
			"gyroscope": (done) => {
				lastDocument(db, "gyroscope", done)
			},
			"temperature": (done) => {
				lastDocument(db, "temperature", done)
			},
			"compass": (done) => {
				lastDocument(db, "compass", done)
			},
			"gps": (done) => {
				lastDocument(db, "gps", done)
			}
		}, (err, result) => {
			var myResult = {
				"orientation": stripProperties(result.orientation[0], defaultProperties),
				"accelerometer": stripProperties(result.accelerometer[0], defaultProperties),
				"gyroscope": stripProperties(result.gyroscope[0], defaultProperties),
				"temperature": stripProperties(result.temperature[0], defaultProperties),
				"compass": stripProperties(result.compass[0], defaultProperties),
				"navigation": stripProperties(result.gps[0], gpsProperties)
			}

			res.end(JSON.stringify(myResult));
		});
	});
};
