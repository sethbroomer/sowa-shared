"use strict";

var configureViewApp = function(app) {
    var exphbs  = require('express3-handlebars'),
        hbs;

    hbs = exphbs.create({
        defaultLayout     : 'main',
        precompiled       : true,
        layoutsDir        : __dirname + '/../views/layouts/',
        sharedPartialsDir : __dirname + '/../views/partials/',
        partialsDir       : 'views/templates/'
    });

    app.set('hbs',hbs);

    app.engine('handlebars', hbs.engine);

    app.set('view engine', 'handlebars');
};

exports.initialize = function(app) {
    configureViewApp(app);
};
