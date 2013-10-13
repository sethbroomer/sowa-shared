'use strict';

var nconf   = require('nconf'),
    routers = require('./config-routers'),
    views   = require('./config-views'),
    logger  = require('./config-logging');



function loadConfig(app) {
    var configFile  = './config/json/config.json',
        argvOptions = {
            'c' : {
                alias : 'config',
                describe : 'path to app config json file'
            }
        };

    nconf.argv(argvOptions).env().file({file: configFile});

    app.set('env', nconf.get('env') || 'development');
}


module.exports = function(app, express, rootPath) {

    // Middleware Settings
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(app.router);

    loadConfig(app);

    //config routers
    routers.initialize(app, rootPath + '/routers');

    // View Settings (Handlebars)
    app.set('view engine', 'hbs');


    //config views
    views.initialize(app);


    // This should always be the LAST line of config
    logger.start(app);

};

