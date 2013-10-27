( function() {
    "use strict";

    SOWA.Backbone = {};




    SOWA.Backbone.BaseView = function(options) {
        Backbone.View.apply(this, [options]);
    };
    _.extend(SOWA.Backbone.BaseView.prototype, Backbone.View.prototype, {

    });

    SOWA.Backbone.BaseView.extend = Backbone.View.extend;


    SOWA.Backbone.BaseModel = function(options) {
        Backbone.Model.apply(this, [options]);
    };

    _.extend(SOWA.Backbone.BaseModel.prototype, Backbone.Model.prototype, {
        _htmlSync: function(options,params) {
            options = options ? _.clone(options) : {};
            params  = params || {};

            var model   = this;
            var success = options.success;
            var params  = {
                type : 'GET',
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    "x-request-type": params.requestType || ''
                }
            };

            options.success = function(resp) {
                var next = function(processedData) {
                    if (success) {
                        success(processedData, model, options);
                    }
                    model.trigger('sync', model, processedData, options);
                };

                SOWA.ScriptManager.processScripts(resp, next);

            };

            wrapError(this, options);

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = _.result(model, 'url') || urlError();
            }

            // Make the request, allowing the user to override any Ajax options.
            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
            model.trigger('request', model, xhr, options);
            return xhr;

        },
        //fetches a tile, we do not fire the parse method because we don't want to allow the user
        //to parse html in a model
        fetchTile: function(options) {
            return this._htmlSync(options,{requestType:'tile'});
        },
        fetchPage: function(options) {
            return this._htmlSync(options,{requestType:'page'});
        }

    });

    SOWA.Backbone.BaseModel.extend = Backbone.Model.extend;



    SOWA.Backbone.BaseCollection = function(options) {
        Backbone.Collection.apply(this, [options]);
    };

    _.extend(SOWA.Backbone.BaseCollection.prototype, Backbone.Collection.prototype, {

    });

    SOWA.Backbone.BaseCollection.extend = Backbone.Collection.extend;


    // Wrap an optional error callback with a fallback error event.
    var wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
            if (error) error(model, resp, options);
            model.trigger('error', model, resp, options);
        };
    };

}());
