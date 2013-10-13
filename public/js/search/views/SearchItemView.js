(function(){
    "use strict";
    WS.Search = WS.Search || {};

    WS.Search.SearchItemView = Backbone.View.extend({

        render: function() {
            var template        = Handlebars.templates['list-item'],
                templateData    = this.getTemplateData();

            this.$el.html(template(templateData));
            
            return this.el;            
        },
        
        getTemplateData: function() {
            var data = this.model.toJSON();

            return data;
        }


    });
}());

