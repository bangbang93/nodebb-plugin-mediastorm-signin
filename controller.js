'use strict';

var topics = require.main.require('./src/topics');
var meta=require.main.require('./src/meta');

var apiController = {};

apiController.getRecentTopics = function(req, next) {

    var stop = (parseInt(req.query.numsOfTopics, 10) || parseInt(meta.config.topicsPerList, 10) || 20) - 1;

    topics.getTopicsFromSet('topics:recent', req.uid, 0, stop, function(err, data) {
        next(err, data);
    });
};

module.exports = apiController;
