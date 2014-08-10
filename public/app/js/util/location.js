define(function (require) {

    var loc = {
        getCurrentLocation: function (callback) {
            $.get("http://ipinfo.io", function (r) {
                callback(r);
            }, "jsonp");
        }
    }

    return loc;
});