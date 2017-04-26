module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.render(
			'index.html.mustache',
			{
				title: "Gizmo2Xtremes Deep Dive Submarine"
			}
		);
	});
};
