(function(){
    "use strict";
    WS.Search = WS.Search || {};

    WS.Search.SearchView = Backbone.View.extend({
        el: 'body',

        events: {
            'click [data-page]'                         : 'handlePage'
        },

        elements: {
            searchList : '#results'
        },

        initialize: function() {
            this.collection      = new WS.Search.SearchCollection();

            this.listenTo(this.collection, 'sync', this.render);
        },

        handlePage: function(e) {
            this.collection.load($(e.currentTarget).data('page'));
        },

        render: function() {
            var rowsFrag    = document.createDocumentFragment(),
                itemView;

            for (var i = 0; i < this.collection.length; i++) {
                itemView = new WS.Search.SearchItemView({model:this.collection.at(i)});
                
                rowsFrag.appendChild(itemView.render());
            }

            this.$el.find(this.elements.searchList).empty().append(rowsFrag);
        }

    });
}());

var foo = new WS.Search.SearchView();
