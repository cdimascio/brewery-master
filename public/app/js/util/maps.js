define(function (require) {

    function map(containerDiv) {
        var markers = []; // TODO ise idToMarkerMap only
        var idToMarkerMap = {};
        var map = null;
        var infowindow = new google.maps.InfoWindow();
        return {
            init: function (searchHandler) {
                map = new google.maps.Map(containerDiv, {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    navigationControl: true,
                    navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.SMALL
                    }
                });

                var sb = searchBox(map, searchHandler)[0];
                sb.index = 1;
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(sb);

                return map;
            },
            clearMarkers: function () {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                idToMarkerMap = {};
            },
            addMarker: function (lat, long, content, data, clickHandler) {
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

                google.maps.event.addListener(marker, 'click', (function (data) {
                    return function () {
                        clickHandler(data);
                    };
                })(data));

                marker._infoContent = content;
                markers.push(marker);
                idToMarkerMap['_' + lat + '' + long] = marker;
            },
            fitBounds: function () {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].position);
                }
                map.fitBounds(bounds);
            },
            selectMarker: function (lat, long) {
                var marker = idToMarkerMap['_' + lat + '' + long];
                infowindow.setContent(marker._infoContent);
                infowindow.open(map, marker);
            }
        }
    }

    function searchBox(map, handler) {
        var container = $('<div/>').
            attr({'class': 'input-map'});
        var input = $('<input/>')
            .attr({
                type: 'text',
                id: 'mapInput',
                name: 'mapInput'})
            .appendTo(container);
        var button = $('<button/>')
            .attr({
                type: 'button',
                id: 'mapSubmit',
                name: 'mapSubmit',
                'class': 'btn-sm btn-primary btn-map'})
            .text('Search').appendTo(container);

        google.maps.event.addDomListener(button[0], 'click', function (evt) {
            evt.searchText = $('#mapInput').val();
            handler(evt);
        });
        return container;
    }

    return map;
});