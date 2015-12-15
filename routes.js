(function(Module) {
    "use strict";

    var controller = require('./controller');

    Module.exports = function(payload, callback) {
        var router = payload.router,
            apiMiddleware = payload.apiMiddleware,
            middleware = payload.coreMiddleware,
            errorHandler = payload.errorHandler;

        router.get('/recent', apiMiddleware.requireUser, function(req, res) {
            controller.getRecentTopics(req, function(error, data) {
                if (error) {
                    return errorHandler.respond(500, res);
                }

                res.json(data);
            });
        });

        callback(null, payload);
    };

})(module);
