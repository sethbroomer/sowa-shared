'use strict';

var Backbone = require('./../helpers/backbone-base');

module.exports = Backbone.Collection.extend({

    url: function() {
        return '/search-' + this.currentPage + '.json';
    },

    initialize: function() {
        this.setPage(1);
    },

    parse: function(response) {
        return response.results;
    },

    setPage: function(page) {
        this.currentPage = page;
    },

    load: function(next) {
        var options = {};

        if(next) {
            options.next = next;
        }
        this.fetch(options);
    }


});