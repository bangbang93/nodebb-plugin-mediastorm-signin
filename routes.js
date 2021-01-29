(function(Module) {
    "use strict";

    var controller = require('./controller');

    Module.exports = function(payload, callback) {
        var router = payload.router

        router.post('/wechatProxy', function (req, res) {
            controller.wechatProxy(req, function (error, data) {
                if (error) {
                    res.json(error)
                } else {
                    res.json(data)
                }
            })
        })

        callback(null, payload);
    };

})(module);
