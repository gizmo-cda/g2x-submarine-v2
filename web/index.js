let express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mustacheExpress = require('mustache-express'),

	path = require('path');

// create app
var app = express();

// app configuration
app.set('port', (process.env.PORT || 8081));

// setup template configuration
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// config middleware
app.use(morgan('dev'));

// config routes
require('./routes/static')(app);

// start server
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;

	console.log("Server listening on port %s", port);
});
