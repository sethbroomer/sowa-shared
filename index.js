'use strict';

var shared = {};



shared.helpers = {
    router       :  require('./helpers/router-middleware'),
    BackboneBase :  require('./helpers/backbone-base')
};

shared.config = {
    initalize : function(app, express, rootPath) {
        return require('./config/config')(app, express, rootPath);
    },
    logger : require('./config/config-logging'),
    router : require('./config/config-routers'),
    view   : require('./config/config-views')
};

shared.nconf = require('nconf');

module.exports = shared;
