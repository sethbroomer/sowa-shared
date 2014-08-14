'use strict';

var helpers = {

    if_eq: function (context, options) {
        if (context === options.hash.compare) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    unless_eq: function (context, options) {
        if (context === options.hash.compare) {
            return options.inverse(this);
        }
        return options.fn(this);
    }
}

module.exports.register = function (Handlebars, options) {
    options = options || {};

    for (var helper in helpers) {
        if (helpers.hasOwnProperty(helper)) {
            Handlebars.registerHelper(helper, helpers[helper]);
        }
    }
};

