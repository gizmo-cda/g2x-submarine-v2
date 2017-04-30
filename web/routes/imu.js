let async = require('async');

function lastDocument(db, collectionName, callback) {
	let collection = db.collection(collectionName);

	collection.count((err, count) => {
		collection.find({}).skip(count - 1).toArray(callback);
	})
}

module.exports = function(app) {
	app.get('/imu', (req, res, next) => {
		let db = app.get('db');
		let accelerometer = db.collection('accelerometer');
		let gyroscope = db.collection('gyroscope');
		let compass = db.collection('compass');
		let temperature = db.collection('temperature');

		async.parallel({
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
			}
		}, (err, result) => {
			var myResult = {
				"accelerometer": result.accelerometer[0],
				"gyroscope": result.gyroscope[0],
				"temperature": result.temperature[0],
				"compass": result.compass[0],
			}

			res.end(JSON.stringify(myResult));
		});
	});
};
