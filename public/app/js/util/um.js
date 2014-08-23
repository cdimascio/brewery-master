define(function () {
    function tweetsToProfileData(tweets) {
        var data = [],
            tweet,
            res = {
                "contentItems": data
            };
        for (var i = 0; i < tweets.length; i++) {
            tweet = tweets[i];
            data[i] = {
                "contenttype": "text/plain",
                "sourceid": "twitter",
                "userid": tweet.user.screen_name,
                "created": new Date(tweet.created_at).getTime(),
                "language": "en",
                "content": tweet.text,
                "id": tweet.id_str
            }
        }
        return res;
    }

    return {
        tweetsToProfileData: tweetsToProfileData
    }
});
