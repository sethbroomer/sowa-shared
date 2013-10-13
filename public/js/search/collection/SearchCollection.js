( function() {
    "use strict";
    WS.Search = WS.Search || {};

    WS.Search.SearchCollection = Backbone.Collection.extend({
        model: WS.Search.SearchItemModel,
        
        url: function() {
            return '/search?p=' + this.currentPage;
        },

        parse: function(response) {
            return response.results;
        },

        load: function(page) {
            this.currentPage = page;
            this.fetch();
        }

    });
}());
////            headers: {
////                "x-request-type":'tile'
////            },
