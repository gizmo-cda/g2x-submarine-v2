let express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mustacheExpress = require('mustache-express'),

	path = require('path'),

	db = require('./lib/db');

// load configuration
let config = {
	"mongo": {
		"host": "localhost",
		"port": 27017,
		"db": "g2x"
	}
}

// create app
var app = express();

// app configuration
app.set('port', (process.env.PORT || 8081));

// configure template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// configure middleware
app.use(morgan('dev'));
app.use(express.static('public'));

// configure routes
require('./routes/static')(app);
require('./routes/nav')(app);

// start server
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;

	console.log("Server listening on port %s", port);

	db(config.mongo, (err, db) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		app.set('db', db);
		console.log("Connected to mongo server:", config.mongo);
	});
});
