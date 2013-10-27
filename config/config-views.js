"use strict";

var configureViewApp = function(app) {
    var exphbs  = require('express3-handlebars'),
        hbs;

    hbs = exphbs.create({
        defaultLayout     : 'main',
        precompiled       : true,
        layoutsDir        : __dirname + '/../views/layouts/',
        partialsDir       : [__dirname + '/../views/partials/','views/partials/'],
        helpers           : {
            javascriptOutputHelper : function(template, context) {

                if(!context.settings) {
                    return '';
                }

                var hbs      = context.settings.hbs,
                    compiled = hbs.compiled,
                    partial  = '';

                Object.keys(compiled).some(function(key) {
                    if(key.indexOf(template) !== -1) {
                        partial = compiled[key](context);
                        return true;
                    }
                });

                return partial;
            }

        }
    });

    app.set('hbs',hbs);

    app.engine('handlebars', hbs.engine);

    app.set('view engine', 'handlebars');
};

exports.initialize = function(app) {
    configureViewApp(app);
};
