'use strict';

var util  = require('util'),
    nconf = require('nconf');


var addConfigForTemplateObject = function(obj) {
    obj._app = nconf.get('app_name');
    obj._staticUrl = nconf.get('static_url');
    return obj;

};
var createTemplateArray = function(template, app) {
    var templates = [];

    // RegExp to remove the ".handlebars" extension from the template names.
    var extRegex = new RegExp(app.get('hbs').extname + '$');

    Object.keys(template).forEach(function (name) {
        templates.push({
            name    : name.replace(extRegex, ''),
            template: template[name]
        });
    });

    return templates;
}


var middleware = {
    exposeJavaScripts: function(req, res, next) {
        var app          = req.app,
            folderName   = (req.templateFolder ? (req.templateFolder + '/') : '') + 'javascripts',
            templatePath = util.format('views/partials/%s', folderName );


 //      Uses the `ExpressHandlebars` instance to get the precompiled templates.
        app.get('hbs').loadTemplates( templatePath ,{
            cache      : app.enabled('view cache'),
            precompiled: true
        }, function (err, template) {

            if (err) { return next(err); }

            var templates = [];

            Object.keys(template).forEach(function (name) {
                templates.push(templatePath + '/' + name);
            });

            if (templates.length) {
                res.locals.appJavaScripts = templates;
            }

            next();
        });
    },

    exposeTemplates: function(req, res, next) {
        var app          = req.app,
            templatePath = util.format('views/partials/%s', (req.templateFolder ? (req.templateFolder + '/') : '') + 'templates'),
            that         = this;

        // Uses the `ExpressHandlebars` instance to get the precompiled templates.
        app.get('hbs').loadTemplates( templatePath ,{
            cache      : app.enabled('view cache'),
            precompiled: true
        }, function (err, template) {
            if (err) { return next(err); }

            var templates = createTemplateArray(template, app);

            // Exposes the templates during view rendering.
            if (templates.length) {
                res.locals.templates = templates;
            }

            that.exposeJavaScripts(req, res, next);

        });
    },

    extendExpress3HandlebarRender: function(req, res, next) {
        res.smartRender = function() {
            var args = Array.prototype.slice.call(arguments, 0),
                that = this,
                render;

            if(res.locals.responseType === 'json') {
                res.json(200, args.pop());
                return;
            }

            render = function() {

                if (args.length < 3 && typeof args[1] === 'function') {
                    arg[2] = arg[1];
                    arg[1] = {};
                }
                //add configuration varaibles that are needed in the templates
                args[1] = addConfigForTemplateObject(args[1]);

                //if its a ajax request and we are requesting a tile then use the partial instead of the full tile
                if(res.req.headers['x-requested-with'] === 'XMLHttpRequest' && res.req.headers['x-request-type'] === 'tile') {
                    res.locals.layout=false;
                    args[0] = 'templates/'  + args[0];
                } else if(res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
                    args[1].layout = 'ajax';
                }

                that.render.apply(that,args);

            }

            req.templateFolder = args[0];
            middleware.exposeTemplates(req, res, render);

        };

        next();
    }

};

module.exports = middleware;
