( function() {
    "use strict";
    SOWA.Utils = SOWA.Utils || {};
    SOWA.ScriptManager = SOWA.ScriptManager || {};

    var SCRIPT_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g,
        SRC_PATTERN    = /<script.*?src ?= ?"([^"]+)"/,
        ID_PATTERN     = /<script.*?id ?= ?"([^"]+)"/;

    SOWA.ScriptManager = {
        processedScripts: [],

        registerScripts: function() {

            var scripts = $.makeArray( $('script') );

            this.processedScripts = [];

            for(var i =0; i < scripts.length; i++) {
                if(scripts[i].src) {
                    this.processedScripts.push(scripts[i].src.replace(/http:|https:/,''));
                } else if(scripts[i].id) {
                    this.processedScripts.push(scripts[i].id);
                }
            }

        },
        processScripts: function(data, next) {
            //remove any scripts that are currently in the manager
            var response =  this._removeDuplicateScripts(data);

            this._loadNewScripts(response.scripts, response.data, next);

        },

        /**
         * Removes duplicate scripts and will return an object containing the 'data' and scripts
         * @param data
         * @returns {Object}
         * @private
         */
        _removeDuplicateScripts: function(data) {
            var list              = data.match(SCRIPT_PATTERN),
                scripts           = [],
                scriptArray       = [],
                inlineScripts     = [],
                script,
                removeScript;

            if(list && list.length){
                for(var i = 0; i < list.length; i++) {
                    removeScript    = true;
                    scriptArray     = list[i].match(SRC_PATTERN);

                    if(!scriptArray) {
                        scriptArray  = list[i].match(ID_PATTERN);
                        removeScript = false;
                    }

                    if(scriptArray && scriptArray.length >=2) {
                        script = scriptArray[1].replace(/http:|https:/,'');

                        //we can't add inline scripts so we don't add it to scripts we are going to process
                        if(removeScript && $.inArray(script, this.processedScripts) === -1){
                            scripts.push(script);
                        } else if(!removeScript && $.inArray(script, this.processedScripts) === -1) {
                            inlineScripts.push(script);
                        } else {
                            removeScript = true;// reset it because we want to delete anything that is currently in the array
                        }
                        if(removeScript) {
                            data = data.replace(list[i],'');

                        }
                    }
                }

                $.merge(this.processedScripts,scripts );
                $.merge(this.processedScripts,inlineScripts );

            }
            return {
                data    : data,
                scripts : scripts
            };
        },

        _loadNewScripts:  function(scripts, data, next) {
            var that       = this;
//            console.info(data)

            if(scripts && scripts.length){

                this._remoteScriptsLoaded = false;
                $LAB
                    .setOptions({AllowDuplicates:false})
                    .script(scripts)
                    .wait(function(){
                        that._remoteScriptsLoaded = true;
                        next(data);
                    });
            } else {
                next(data);
            }
        }
    };

}());