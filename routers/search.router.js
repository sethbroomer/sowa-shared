'use strict';

var SearchCollection = require('./../collections/search.collection');


module.exports = function(app) {



    function handleSearchRequest(req, res) {
        app.logger.debug("calling search");

        var searchCollection = new SearchCollection(),
            searchResponse   = function(error, response, body)  {
                res.smartRender('search', body);
                //Generic way for error codes
//             res.smartRender(200,'search', body);

            };

        searchCollection.setPage(req.query.p || 1);
        searchCollection.load(searchResponse);

    }

    // Initial Page Request
    app.get('/search',  handleSearchRequest);
};
