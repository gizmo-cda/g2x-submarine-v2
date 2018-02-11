var MjpegProxy = require('mjpeg-proxy').MjpegProxy;
var express = require('express');
var app = express();

app.get(
	'/control.jpg',
	new MjpegProxy('http://192.168.0.1:8080/stream/video.mjpeg').proxyRequest
);
app.get(
	'/communications.jpg',
	new MjpegProxy('http://192.168.0.2:8080/stream/video.mjpeg').proxyRequest
);
app.listen(8080);
