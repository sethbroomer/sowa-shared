'use strict';

var path   = require('path'),
    nconf = require('nconf');

var JAVASCRIPT_FOLDER = 'javascript',
    TEMPLATE_FOLDER   = 'templates',
    CSS_FOLDER        = 'css';

var addConfigForTemplateObject = function(obj) {
    obj._app = nconf.get('app_name');
    obj._staticUrl = nconf.get('static_url');
    obj._version = nconf.get('version') || '';
    return obj;

};

var middleware = {
    exposeJavaScripts: function(req, res, next) {
        var app          = req.app,
            templatePath = path.join('views/partials', (req.templateFolder ? req.templateFolder  : '') , JAVASCRIPT_FOLDER);

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
            folderName   = (req.templateFolder ? req.templateFolder  : ''),
            templatePath = path.join('views/partials', folderName , TEMPLATE_FOLDER),
            that         = this;

        // Uses the `ExpressHandlebars` instance to get the precompiled templates.
        app.get('hbs').loadTemplates( templatePath ,{
            cache      : app.enabled('view cache'),
            precompiled: true
        }, function (err, template) {
            if (err) { return next(err); }

            var templates = [];

            // RegExp to remove the ".handlebars" extension from the template names.
            var extRegex = new RegExp(app.get('hbs').extname + '$');

            Object.keys(template).forEach(function (name) {
                templates.push({
                    name    : name.replace(extRegex, ''),
                    prefix  : folderName ? (folderName + '/') : '',
                    template: template[name]
                });
            });

            // Exposes the templates during view rendering.
            if (templates.length) {
                res.locals.templates = templates;
                res.locals._folderName = folderName;
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
                    args[2] = args[1];
                    args[1] = {};
                }
                //add configuration varaibles that are needed in the templates
                args[1] = addConfigForTemplateObject(args[1]);

                //if its a ajax request and we are requesting a tile then use the partial instead of the full tile
                if(res.req.headers['x-requested-with'] === 'XMLHttpRequest' && res.req.headers['x-request-type'] === 'tile') {
                    res.locals.layout=false;
                    args[0] = path.join('partials', args[0], TEMPLATE_FOLDER, args[0]);
                } else if(res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
                    args[1].layout = 'ajax';
                }

                that.render.apply(that,args);

            };

            req.templateFolder = args[0];
            middleware.exposeTemplates(req, res, render);

        };

        next();
    }

};

module.exports = middleware;
