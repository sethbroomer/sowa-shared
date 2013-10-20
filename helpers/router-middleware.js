'use strict';

var util  = require('util'),
    nconf = require('nconf');


var addConfigForTemplateObject = function(obj) {
    obj._app = nconf.get('app_name');
    obj._staticUrl = nconf.get('static_url');
    return obj;

};

module.exports  = {
    exposeTemplates: function(req, res, next) {
        var app          = req.app;
        var templatePath = util.format('views/%s/partials', req.pageFolder || 'templates');


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
                        template: template[name]
                    });
                });

                // Exposes the templates during view rendering.
                if (templates.length) {
                    res.locals.templates = templates;
                }

                next();
            });
    },

    extendExpress3HandlebarRender: function(req, res, next) {
        res.smartRender = function() {
            var args = Array.prototype.slice.call(arguments, 0);

            if(res.locals.responseType === 'json') {
                res.json(200, args.pop());

            } else {
                //add configuration varaibles that are needed in the templates
                for(var i =0; i < args.length; i++) {
                    if(typeof args[i] === 'object' && Object.prototype.toString.call(args[i]) === "[object Object]") {
                        args[i] = addConfigForTemplateObject(args[i]);
                    }
                }

                //if its a ajax request and we are requesting a tile then use the partial instead of the full tile
                if(res.req.headers['x-requested-with'] === 'XMLHttpRequest' && res.req.headers['x-request-type'] === 'tile') {
                    args[0] = 'templates/'  + args[0];
                }

                this.render.apply(this,args);
            }
        };

        next();
    }
};

