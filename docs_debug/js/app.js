/*! Alpbrothers - ui.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        /** Initializes the UI. */
        function init() {
            // common fixes and init
            $ui.disableAnimationsOnLoad(); // disable animations until page has loaded
            $ui.fixIEFlexbox(); // fix IE flexbox min-height bug
            $ui.fixObjectFit(); // fix object fit
            $ui.checkSvgCompatibility(); // use png if svg is not supported
            // init ui parts
            $ui.initSmoothScroll(); // init smooth scrolling buttons
            $ui.initWrapper(); // init wrapper element
            $ui.initItems(); // init item lists
            $ui.gallery.init(); // init gallery
            $ui.menu.init(); // menu
            $ui.maps.init(); // google maps
        }
        $ui.init = init;
        /** Initializes the UI for smooth scrolling. */
        function initSmoothScroll() {
            $('.smooth-scroll').scrolly();
            $('.smooth-scroll-middle').scrolly({ anchor: 'middle' });
        }
        $ui.initSmoothScroll = initSmoothScroll;
        /** Disables animations until the page has loaded. */
        function disableAnimationsOnLoad() {
            $alpbros.$body.addClass('is-loading');
            $alpbros.$window.on('load', function () {
                window.setTimeout(function () {
                    $alpbros.$body.removeClass('is-loading');
                }, 100);
            });
        }
        $ui.disableAnimationsOnLoad = disableAnimationsOnLoad;
        /** Checks for SVG compatibility and changes images to use .png if .svg is not supported. */
        function checkSvgCompatibility() {
            if (Modernizr.svgasimg)
                return;
            $("img.svg").each(function (i, el) {
                convertSvgToPng($(el));
            });
        }
        $ui.checkSvgCompatibility = checkSvgCompatibility;
        /** Replaces .svg by .png of the specified image source. */
        function convertSvgToPng(img) {
            var src = img.attr("src");
            img.attr("src", src.replace(".svg", ".png"));
        }
        $ui.convertSvgToPng = convertSvgToPng;
        /** Fixes IE flexbox min-height bug. */
        function fixIEFlexbox() {
            if (skel.vars.browser != 'ie')
                return;
            var flexboxFixTimeoutId;
            $alpbros.$window.on('resize.flexbox-fix', function () {
                var $x = $('.fullscreen');
                clearTimeout(flexboxFixTimeoutId);
                flexboxFixTimeoutId = setTimeout(function () {
                    if ($x.prop('scrollHeight') > $alpbros.$window.height())
                        $x.css('height', 'auto');
                    else
                        $x.css('height', '100vh');
                }, 250);
            }).triggerHandler('resize.flexbox-fix');
        }
        $ui.fixIEFlexbox = fixIEFlexbox;
        /** Fixes object fix. */
        function fixObjectFit() {
            if (skel.canUse('object-fit'))
                return;
            $('.banner .image, .spotlight .image').each(function (idx, el) {
                var $el = $(el), $img = $el.children('img'), positionClass = $el.parent().attr('class').match(/image-position-([a-z]+)/);
                // set image.
                $el.css('background-image', 'url("' + $img.attr('src') + '")')
                    .css('background-repeat', 'no-repeat')
                    .css('background-size', 'cover');
                // set position.
                switch (positionClass.length > 1 ? positionClass[1] : '') {
                    case 'left':
                        $el.css('background-position', 'left');
                        break;
                    case 'right':
                        $el.css('background-position', 'right');
                        break;
                    case 'center':
                    default:
                        $el.css('background-position', 'center');
                        break;
                }
                // hide original.
                $img.css('opacity', '0');
            });
        }
        $ui.fixObjectFit = fixObjectFit;
        /** Initializes all item lists. */
        function initItems() {
            scrollex(".items", { delay: 50 })
                .children()
                .wrapInner('<div class="inner"></div>');
        }
        $ui.initItems = initItems;
        /** Initializes the wrapper element. */
        function initWrapper() {
            scrollex($alpbros.$wrapper.children());
        }
        $ui.initWrapper = initWrapper;
        function scrollex(arg, opt) {
            // get elements
            var elements = (typeof arg == "string") ? $(arg) : arg;
            // extend default options
            opt = $.extend({
                top: '30vh',
                bottom: '30vh',
                initialize: function () { $(this).addClass('is-inactive'); },
                terminate: function () { $(this).removeClass('is-inactive'); },
                enter: function () { $(this).removeClass('is-inactive'); },
                leave: function () {
                    var el = $(this);
                    if (el.hasClass('onscroll-bidirectional'))
                        el.addClass('is-inactive');
                }
            }, opt);
            // execute jquery scrollex plugin
            return elements.scrollex(opt);
        }
        $ui.scrollex = scrollex;
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - ui-gallery.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var gallery;
        (function (gallery) {
            /** Initializes all galleries. */
            function init() {
                // basic init
                $ui.scrollex($('.gallery')
                    .wrapInner('<div class="inner"></div>')
                    .prepend(skel.vars.mobile ? '' : '<div class="forward"></div><div class="backward"></div>'), { delay: 50 })
                    .children('.inner')
                    .css('overflow-y', skel.vars.mobile ? 'visible' : 'hidden')
                    .css('overflow-x', skel.vars.mobile ? 'scroll' : 'hidden')
                    .scrollLeft(0);
                // initialize lighbox feature
                initLightbox();
            }
            gallery.init = init;
            /** Initializes the lightbox feature. */
            function initLightbox() {
                $('.gallery.lightbox').on('click', 'a', function (e) {
                    var $a = $(this), $gallery = $a.parents('.gallery'), $modal = $gallery.children('.modal'), $modalImg = $modal.find('img'), href = $a.attr('href');
                    // not an image?
                    if (!href.match(/\.(jpg|gif|png|mp4)$/))
                        return;
                    // prevent default.
                    e.preventDefault();
                    e.stopPropagation();
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // lock.
                    $modal[0]._locked = true;
                    // set src, visible and focus
                    $modalImg.attr('src', href);
                    $modal.addClass('visible');
                    $modal.focus();
                    // delay and unlock.
                    setTimeout(function () { $modal[0]._locked = false; }, 600);
                })
                    .on('click', '.modal', function (e) {
                    var $modal = $(this), $modalImg = $modal.find('img');
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // already hidden?
                    if (!$modal.hasClass('visible'))
                        return;
                    // lock.
                    $modal[0]._locked = true;
                    // clear visible, loaded.
                    $modal.removeClass('loaded');
                    // delay and hide.
                    setTimeout(function () {
                        $modal.removeClass('visible'); // hide
                        setTimeout(function () {
                            // clear src, unlock and set focus to body
                            $modalImg.attr('src', '');
                            $modal[0]._locked = false;
                            $alpbros.$body.focus();
                        }, 475);
                    }, 125);
                })
                    .on('keypress', '.modal', function (event) {
                    var $modal = $(this);
                    // escape? hide modal.
                    if (event.keyCode == 27)
                        $modal.trigger('click');
                })
                    .prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
                    .find('img')
                    .on('load', function (e) {
                    var $modalImg = $(this), $modal = $modalImg.parents('.modal');
                    setTimeout(function () {
                        // no longer visible?
                        if (!$modal.hasClass('visible'))
                            return;
                        // set loaded.
                        $modal.addClass('loaded');
                    }, 275);
                });
            }
            /** Initializes all style2 galleries. NOT USED AT THE MOMENT. */
            /*function initStyle2()
            {
              $('.gallery.style2').on('wheel', '.inner', function (e)
              {
                var $this=$(this),
                  delta=((<any>e.originalEvent).deltaX*10);
          
                // cap delta.
                if (delta>0)
                  delta=Math.min(25, delta);
                else if (delta<0)
                  delta=Math.max(-25, delta);
          
                // scroll.
                $this.scrollLeft($this.scrollLeft()+delta);
          
              })
              .on('mouseenter', '.forward, .backward', function (e)
              {
                var $this=$(this),
                  $inner=$this.siblings('.inner'),
                  direction=($this.hasClass('forward')? 1:-1);
          
                // clear move interval.
                clearInterval(this._gallery_moveIntervalId);
          
                // start interval.
                this._gallery_moveIntervalId=setInterval(function ()
                {
                  $inner.scrollLeft($inner.scrollLeft()+(5*direction));
                }, 10);
          
              })
              .on('mouseleave', '.forward, .backward', function (e)
              {
                // clear move interval.
                clearInterval(this._gallery_moveIntervalId);
              });
            }*/
        })(gallery = $ui.gallery || ($ui.gallery = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - ui-map.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var maps;
        (function (maps_1) {
            var apikey = "AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
            var currentIdx = 0;
            var maps = [];
            /** Initializes all maps. */
            function init() {
                $(".map").q().ForEach(function (x) { return maps.push(createMap(x)); });
            }
            maps_1.init = init;
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
                    styles: $ui.mapStyle
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
        })(maps = $ui.maps || ($ui.maps = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - ui-map-style.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        $ui.mapStyle = [
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
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
/*! Alpbrothers - ui-menu.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var menu;
        (function (menu_1) {
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
            menu_1.init = init;
            /** Opens the menu. */
            function open() {
                mbtn.addClass("fa-close").removeClass("fa-bars");
                $alpbros.$wrapper.addClass("menu-opened");
                menu.addClass("opened");
            }
            menu_1.open = open;
            /** Closes the menu. */
            function close() {
                mbtn.addClass("fa-bars").removeClass("fa-close");
                $alpbros.$wrapper.removeClass("menu-opened");
                menu.removeClass("opened");
            }
            menu_1.close = close;
        })(menu = $ui.menu || ($ui.menu = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
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
            $alpbros.$window = $(window);
            $alpbros.$body = $(document.body);
            $alpbros.$wrapper = $("#wrapper");
            // initialize ui
            $alpbros.$ui.init();
        }
        $app.init = init;
    })($app = $alpbros.$app || ($alpbros.$app = {}));
    // set skel breakpoints
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });
    // init app on document ready
    $(document).ready(function () {
        $app.init();
    });
})($alpbros || ($alpbros = {}));
