module.exports = function(app) {
	let db = app.get('db');
	let compass = db.collection['compass'];

	app.get('/imu', (req, res, next) => {
		compass.find({}).toArray((err, docs) => {
			res.end(JSON.stringify(docs));
		});
	});
};
