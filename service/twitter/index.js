var twitter = require('twitter'),
    twit = new twitter(require('../util').twitter());

exports.tweet = function(req, res) {
    var q = req.query.q;
    twit.search(q, req.query, function(data) {
        res.json({
            tweets : data.statuses
        });
    });
};