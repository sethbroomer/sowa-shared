'use strict';

var rootPath = __dirname,
    nconf    = require('nconf'),
    express  = require('express'),
    app      = express();

require('./config/config')(app, express, rootPath);

app.listen(nconf.get('node_port'));
