'use strict';

// Dependencies

var express         = require('express'),
    validator       = require('express-validator'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    methodOverride  = require('method-override'),
    app             = express(),
    mongoose        = require('mongoose'),
    config          = require('./config');

// Database

var connectionString = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || config.db;

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString, function(err, res) {
    if (err)
        console.log("Error al conectarse a la base de datos: " + err);
    else
        console.log("Conexión con la base de datos");
});

// Server configurations

app.use(validator());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
require('./routes')(app, config);

// Server

var PORT = process.env.OPENSHIFT_NODEJS_PORT || config.server.port;
var HOST = process.env.OPENSHIFT_NODEJS_IP || config.server.host;

app.listen(PORT, HOST, function(err) {
    if (err)
        console.log(err);
    else
        console.log("Servidor: http://" + HOST + ":" + PORT + "/");
});
