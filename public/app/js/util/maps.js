define(function (require) {

    function map(containerDiv) {
        var map = null;
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();
        return {
            init: function () {
                map = new google.maps.Map(containerDiv, {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    navigationControl: true,
                    navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.SMALL
                    }
                });

                map.fitBounds(bounds);

                var sb = searchBox(map)[0];
                sb.index = 1;
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(sb);

                return map;
            },

            addMarker : function(lat, long, content, data, clickHandler) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    map: map
                });

                google.maps.event.addListener(marker, 'click', (function (marker, content) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                    };
                })(marker, content));

               /* google.maps.event.addListener(marker, 'mouseout', (function () {
                    return function () {
                        infowindow.close();
                    }
                })());*/

                google.maps.event.addListener(marker, /*'dblclick'*/ 'click', (function (data) {
                    return function() {
                        clickHandler(data);
                    };
                })(data));

                bounds.extend(marker.position);
            }
        };
    }

    function searchBox(map) {
        var container = $('<div/>').
            attr({'class': 'input-map'});
        $('<input/>')
            .attr({
                type: 'text',
                id: 'mapInput',
                name: 'mapInput'})
            .appendTo(container);
        $('<button/>')
            .attr({
                type: 'button',
                id: 'mapSubmit',
                name: 'mapSubmit',
                'class': 'btn-sm btn-primary btn-map'})
            .text('Search').appendTo(container);

        google.maps.event.addDomListener(container[0], 'click', function() {
            alert('clicked');
        });
        return container;
    }

    return map;
});