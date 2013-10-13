'use strict';

var nconf   = require('nconf'),
    _       = require('underscore'),
    request = require('request'),
    url     = require('url');

module.exports  = function(settings) {
    var mapping = {},
        urlObject,
        defaults = {
            cache       : true,
//            contentType : 'application/json',
            dataType    : 'json',
            type        : 'GET'
        };

    _.defaults(settings, defaults);

    mapping = {
        url     : settings.url,
        qs      : settings.data,
        method  : settings.type,
        json    : settings.dataType === 'json'

    };

    if(mapping.method === 'GET') {
        mapping.qa = settings.data;
    } else {
        mapping.body = settings.data;
    }

    urlObject = url.parse(mapping.url);

    //1 check to see if a full url is passed in
    //2 if it doesn't exists look at the config
    if(!urlObject.protocol) {
        mapping.url = (nconf.get('services:defaults:url') ? nconf.get('services:defaults:url') : '') +  mapping.url;
    }

    request(mapping, function (error, response, body) {
        if(!error && response.statusCode === 200) {
            if(settings.next) {
                settings.next.apply(this,arguments);
            }
        }
    });

};


