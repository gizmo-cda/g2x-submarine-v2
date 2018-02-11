var request = require("request");
var MjpegConsumer = require("mjpeg-consumer");
var FileOnWrite = require("file-on-write");

var config = {
	"navigation": {
		"url": "http://192.168.0.1:8080/stream/video.mjpeg",
		"writer": new FileOnWrite({ 
			path: '/Volumes/Shuttle/G2X/video/navigation',
			ext: '.jpg'
		}),
		"consumer": new MjpegConsumer()
	},
	"communications": {
		"url": "http://192.168.0.2:8080/stream/video.mjpeg",
		"writer": new FileOnWrite({ 
			path: '/Volumes/Shuttle/G2X/video/communications',
			ext: '.jpg'
		}),
		"consumer": new MjpegConsumer()
	}
};

for (var name in config) {
	var server = config[name];

	request(server.url).pipe(server.consumer).pipe(server.writer);
}
