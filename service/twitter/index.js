// PLEASE DO NOT USE THESE CREDENTIALS:
// These credentials belong to dimascio@us.ibm.com
var twitter = require('twitter'),
    twit = new twitter({
        consumer_key : '644DiRaFxOG7V6Z1COMXEPhhu',
        consumer_secret : 'VVbaZhCSjp2avkAneXyfjdzKp3vT94lUoJgcWUUOKL4OyjZD3e',
        access_token_key : '24015584-8sGwoinpk1cVcqSpyoRZdzb5ecJCSofWk122pTBfH',
        access_token_secret : 'RJKhxSJy5HfRLaqDbrQ3gvIvrQ0ElpkgEeMKrSvzmNPf7'
    });

exports.tweet = function(req, res) {
    var q = req.query.q;
    twit.search(q, req.query, function(data) {
        res.json({
            tweets : data.statuses
        });
    });
};