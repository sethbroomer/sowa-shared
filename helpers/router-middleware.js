'use strict';

var util  = require('util'),
    nconf = require('nconf');


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

                for(var i =0; i < args.length; i++) {
                    if(typeof args[i] === 'object' && Object.prototype.toString.call(args[i]) === "[object Object]") {
                        args[i]._app = nconf.get('app_name');
                    }
                }

                this.render.apply(this,args);
            }
        };

        next();
    }
};

