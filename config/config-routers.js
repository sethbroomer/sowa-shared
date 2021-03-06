"use strict";

var fs         = require('fs'),
    baseRouter = require('./../helpers/router-middleware');


var defaultRouters = function(app) {

    app.get('/*', baseRouter.extendExpress3HandlebarRender,  function(req,res,next){
        if(res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.locals.responseType = 'json';

            if(res.req.headers['x-request-type'] === 'tile' || res.req.headers['x-request-type'] === 'page') {
                res.locals.responseType = 'html';
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


exports.initialize = function(app, path) {
    defaultRouters(app);
    readdirSyncRecursiveForRoute(app, path);
};

