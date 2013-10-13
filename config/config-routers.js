"use strict";

var fs         = require('fs'),
    baseRouter = require('./../helpers/router-middleware.js');


var defaultRouters = function(app) {

    app.get('/*', baseRouter.extendExpress3HandlebarRender, baseRouter.exposeTemplates, function(req,res,next){
        if(res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.locals.layout=false;

            if(res.req.headers['x-request-type'] !== 'tile') {
                res.locals.responseType = 'json';
            }
        }

        next();
    });
};

var readdirSyncRecursiveForRoute = function(app, path) {
    var stats = fs.statSync(path);

    if(stats.isFile() && path.lastIndexOf('.js') !== -1) {
        require(path)(app);
    } else if(stats.isDirectory() ) {
        fs.readdirSync(path).forEach(function(file) {
            if(file.charAt(0) !== '.'){
                readdirSyncRecursiveForRoute(app,  path + '/' + file);
            }
        });
    }

};


exports.configRouters = function(app, path) {
    defaultRouters(app);
    readdirSyncRecursiveForRoute(app, path);
};

