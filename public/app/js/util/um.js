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

    function filterTraits(umdata,keeptraits) {
	var local = umdata;
	function traitExists(object) {
	  if(keeptraits.indexOf(object.name) >= 0) {
	   return true;
	  }
	  return false;
	};
	var f = function(t) {
	    if(t.children) {
		for(var i=0; i<t.children.length; i++) {
	        var element = t.children[i];
		   if(element.children) {
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

    return {
        tweetsToProfileData: tweetsToProfileData,
	filterTraits: filterTraits
    }
});
