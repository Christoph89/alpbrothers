/*! Alpbrothers - maps.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $maps;
    (function ($maps) {
        var apikey = "AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
        var currentIdx = 0;
        var maps = [];
        function init() {
            $(".map").q().ForEach(function (x) { return maps.push(createMap(x)); });
        }
        $maps.init = init;
        function createMap(cnt) {
            var map = { element: cnt };
            var lat = parseFloat(cnt.attr("lat"));
            var lng = parseFloat(cnt.attr("lng"));
            var zoom = parseFloat(cnt.attr("zoom"));
            if (lat && lng)
                map.start = { lat: lat, lng: lng };
            if (zoom)
                map.zoom = zoom;
            // read markers
            map.marker = $q($(".marker", cnt)).Select(function (x) {
                var marker = {
                    position: {
                        lat: parseFloat(x.attr("lat")),
                        lng: parseFloat(x.attr("lng"))
                    },
                    title: x.text()
                };
                return marker;
            }).ToArray();
            window["initMap" + currentIdx] = function () { initMap(map); };
            cnt.after('<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + apikey + '&callback=initMap' + currentIdx + '"></script>');
            currentIdx++;
            return map;
        }
        function initMap(map) {
            // initialize the map and set the start location
            var gmap = new google.maps.Map(map.element[0], {
                center: map.start ? { lat: map.start.lat, lng: map.start.lng } : null,
                zoom: map.zoom,
                styles: $alpbros.mapStyle
            });
            // add some markers
            var markers = $q(map.marker).ForEach(function (m) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(m.position.lat, m.position.lng),
                    title: m.title
                });
                marker.setMap(gmap);
            });
            // prevent mouse event capturing
            var innerMap;
            map.element.mouseenter(function () {
                if (!innerMap) {
                    innerMap = map.element.children().first();
                    innerMap.mouseleave(function () { innerMap.addClass("no-pointer-events"); });
                }
                innerMap.addClass("no-pointer-events");
            });
            map.element.click(function () { innerMap.removeClass("no-pointer-events"); });
        }
    })($maps = $alpbros.$maps || ($alpbros.$maps = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - app.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    $alpbros.mapStyle = [
        {
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": 50
                },
                {
                    "gamma": 0
                },
                {
                    "hue": "#50a5d1"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#333333"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [
                {
                    "weight": 0.5
                },
                {
                    "color": "#333333"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "gamma": 1
                },
                {
                    "saturation": 50
                }
            ]
        }
    ];
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - menu.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $menu;
    (function ($menu) {
        var mbtn;
        var menu;
        /** Initializes the menu. */
        function init() {
            mbtn = $("#menu-btn");
            menu = $("#menu");
            // toggle menu on menu button click
            mbtn.click(function () {
                if ($alpbros.$wrapper.hasClass("menu-opened"))
                    close();
                else
                    open();
            });
            // close menu when clicking outside of the inner container
            menu.click(function (e) {
                var target = $(e.target);
                if (target.attr("id") == "menu" || target.hasClass("icon"))
                    close();
            });
        }
        $menu.init = init;
        /** Opens the menu. */
        function open() {
            mbtn.addClass("fa-close").removeClass("fa-bars");
            $alpbros.$wrapper.addClass("menu-opened");
            menu.addClass("opened");
        }
        $menu.open = open;
        /** Closes the menu. */
        function close() {
            mbtn.addClass("fa-bars").removeClass("fa-close");
            $alpbros.$wrapper.removeClass("menu-opened");
            menu.removeClass("opened");
        }
        $menu.close = close;
    })($menu = $alpbros.$menu || ($alpbros.$menu = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - util.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $util;
    (function ($util) {
        /** Checks for SVG compatibility and changes images to use .png if .svg is not supported. */
        function checkSvgCompatibility() {
            if (Modernizr.svgasimg)
                return;
            $("img.svg").each(function (i, el) {
                convertSvgToPng($(el));
            });
        }
        $util.checkSvgCompatibility = checkSvgCompatibility;
        /** Replaces .svg by .png of the specified image source. */
        function convertSvgToPng(img) {
            var src = img.attr("src");
            img.attr("src", src.replace(".svg", ".png"));
        }
        $util.convertSvgToPng = convertSvgToPng;
    })($util = $alpbros.$util || ($alpbros.$util = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - app.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $app;
    (function ($app) {
        function init() {
            // get main elements
            $alpbros.$wrapper = $("#wrapper");
            // init ui
            $alpbros.$menu.init(); // menu
            $alpbros.$maps.init(); // google maps
            $alpbros.$util.checkSvgCompatibility(); // use png if svg is not supported
        }
        $app.init = init;
    })($app = $alpbros.$app || ($alpbros.$app = {}));
    // init app on document ready
    $(document).ready(function () {
        $app.init();
    });
})($alpbros || ($alpbros = {}));
