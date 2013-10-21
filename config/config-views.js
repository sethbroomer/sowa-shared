"use strict";

var configureViewApp = function(app) {
    var exphbs  = require('express3-handlebars'),
        hbs;

    hbs = exphbs.create({
        defaultLayout     : 'main',
        precompiled       : true,
        layoutsDir        : __dirname + '/../views/layouts/',
        partialsDir       : [ __dirname + '/../views/partials/',
                                'views/templates/']
    });

    app.set('hbs',hbs);

    app.engine('handlebars', hbs.engine);

    app.set('view engine', 'handlebars');
};

exports.initialize = function(app) {
    configureViewApp(app);
};
