'use strict';

var nconf        = require('nconf'),
    log4js       = require('log4js'),
    createDomain = require('domain').create;

module.exports.domainLoggingMiddleware = function () {
    return function domainLoggingMiddleware(req, res, next) {
        var domain  = createDomain(),
            count   = 0;

        domain.id = function() {
            return new Date().getTime() + (count++);
        };

        domain.add(req);
        domain.add(res);

        domain.run(function() {
            next();
        });

        domain.on('error', function(e) {
            next(e);
        });
    };
};

var configLogger = function(app) {

    var config = nconf.get('logging');


    log4js.configure(config.log_config);

    //define logger
    app.logger = log4js.getLogger(config.log_config.appenders[0].category);
    app.logger.setLevel(config.log_level);

    app.use(module.exports.domainLoggingMiddleware());
    app.use(log4js.connectLogger(app.logger));

    app.use(function(err, req, res, next){
        var message = [];

        if(req && req.url) {
            message.push(req.url);
        }

        message.push(err.stack);

        app.logger.error(message.join('\n'));

        next();
    });

};

module.exports.start = configLogger;

