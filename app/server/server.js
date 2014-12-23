'use strict';

var express = require('express'),
	favicon = require('serve-favicon'),
	app     = express(),
	path	= require('path'),
	PORT    = 80;

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(favicon(path.resolve(__dirname, '../client/dist/assets/favicon.png')));

app.all('/*', function(req, res) {
	res.sendFile('index.html', {root: path.resolve(__dirname, '../client/dist')});
});

app.listen(PORT, '0.0.0.0', function(err) {
	if (err)
		console.log(err);
	else
		console.log("Servidor NodeJS: http://localhost:" + PORT + '/');
});
