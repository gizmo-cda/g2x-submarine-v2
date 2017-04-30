module.exports = function(app) {
	app.get('/imu', (req, res, next) => {
		let db = app.get('db');
		let compass = db.collection('compass');

		if (compass !== undefined) {
			compass
				.find({})
				.skip(compass.count() - 1)
				.limit(1)
				.toArray((err, docs) => {
					res.end(JSON.stringify(docs[0]));
				});
		}
		else {
			res.end(JSON.stringify({
				status: 500,
				text: "cannot find 'compass' collection"
			}));
		}
	});
};
