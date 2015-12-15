(function(Plugin) {
    'use strict';

    var routes = require('./routes');

    Plugin.extendApiRoutes = function(payload, callback) {
        routes(payload, callback);
    };

})(module.exports);
