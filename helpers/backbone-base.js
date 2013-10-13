'use strict';

var Backbone = require('Backbone'),
    ajax     = require('./jquery-ajax-emulator');

//Don't want people to use these so clearing them out for now
Backbone.View = {};
Backbone.Events = {};
Backbone.History = function() {};

Backbone.ajax = ajax;
//Backbone.sync = function(method, model, options) {
//    var type = methodMap[method];
//
//    // Default options, unless specified.
//    _.defaults(options || (options = {}));
//
//    // Default JSON-request options.
//    var params = {type: type};
//
//    // Ensure that we have a URL.
//    if (!options.url) {
//        params.url = _.result(model, 'url') || urlError();
//    }
//
//
//    // Make the request, allowing the user to override any Ajax options.
//    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
//    model.trigger('request', model, xhr, options);
//    return xhr;
//
//}



module.exports = Backbone;