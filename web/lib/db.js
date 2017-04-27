module.exports = (config, cb) => {
	let MongoClient = require('mongodb').MongoClient,
		util = require('util');

	// build mongodb url
	let url = util.format("mongodb://%s:%s/%s", config.host, config.port, config.db);

	// connect to mongo server
	MongoClient.connect(url, cb);
}
