"use strict";

var configureViewApp = function(app) {
    var exphbs  = require('express3-handlebars'),
        hbs;

    hbs = exphbs.create({
        defaultLayout   : 'main',
        precompiled     : true,
        layoutsDir      : 'views/layouts/',
        partialsDir     : 'views/templates/'
    });

    app.set('hbs',hbs);

    app.engine('handlebars', hbs.engine);

    app.set('view engine', 'handlebars');
};

exports.configureView = function(app) {
    configureViewApp(app);
};
