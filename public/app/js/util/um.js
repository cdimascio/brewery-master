define(function () {
    function tweetsToProfileData(tweets) {
        var incTweetText = function(text) {
            var min = 300, newText=text;
            while (newText.length < min) {
                newText += newText + ' '+ newText
            }
            return newText;
        }
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
                "content": incTweetText(tweet.text),
                "id": tweet.id_str
            }
        }
        return res;
    }

    function filterTraits(umdata, keeptraits) {
        var local = umdata;

        function traitExists(object) {
            if (keeptraits.indexOf(object.name) >= 0) {
                return true;
            }
           // return false;
            return true;
        };
        var f = function (t) {
            if (t.children) {
                for (var i = 0; i < t.children.length; i++) {
                    var element = t.children[i];
                    if (element.children) {
                        f(element);
                    } else {
                        var newtarr = t.children.filter(traitExists);
                        t.children = newtarr;
                    }
                }
            }
        };
        f(local.tree);
        return local;
    }

    function flatten(tree) {
        var arr = [],
            f = function (t, level) {
                if (!t) {
                    return;
                }

                if (level > 0 && (!t.children || level !== 2)) {
                    var obj = {};
                    obj.id = t.id;

                    if (t.children) {
                        obj.title = true;
                    }
                    if (t.percentage) {
                        obj.value = Math.floor(t.percentage * 100) + "%";
                    }
                    arr.push(obj);
                }
                if (t.children && t.id !== 'sbh') {
                    for (var i = 0; i < t.children.length; i++) {
                        f(t.children[i], level + 1);
                    }
                }
            };
        f(tree, 0);
        return arr;
    }

    return {
        tweetsToProfileData: tweetsToProfileData,
        filterTraits: filterTraits,
        flatten : flatten
    }
});
