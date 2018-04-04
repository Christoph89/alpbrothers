/*! Alpbrothers - def.ts
* Copyright Christoph Schaunig 2017
*/
/// <reference path="ref.d.ts" />
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var $alpbros;
(function ($alpbros) {
    /** Specifies all roles. */
    var Roles;
    (function (Roles) {
        /** Partner role. */
        Roles[Roles["Partner"] = 2] = "Partner";
        /** WWW role. */
        Roles[Roles["WWW"] = 3] = "WWW";
        /** Admin role. */
        Roles[Roles["Admin"] = 4] = "Admin";
    })(Roles = $alpbros.Roles || ($alpbros.Roles = {}));
    var MTBLevel;
    (function (MTBLevel) {
        MTBLevel[MTBLevel["Everyone"] = 0] = "Everyone";
        MTBLevel[MTBLevel["Beginner"] = 1] = "Beginner";
        MTBLevel[MTBLevel["Advanced"] = 2] = "Advanced";
        MTBLevel[MTBLevel["All"] = 3] = "All";
    })(MTBLevel = $alpbros.MTBLevel || ($alpbros.MTBLevel = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $util;
    (function ($util) {
        /** Returns the formatted date string of the specified datetime. */
        function formatDate(date, format) {
            return date.format(format);
        }
        $util.formatDate = formatDate;
        /** Returns the formatted string for the specified from/to date. */
        function formatFromTo(from, to, format, multiDayFormat) {
            if (multiDayFormat && !dateEquals(from, to))
                format = multiDayFormat; // mulitple days
            var parts = format.split("-");
            return from.format(parts[0].trim()) + " - " + to.format(parts[1].trim());
        }
        $util.formatFromTo = formatFromTo;
        /** Returns whether the date part of the specified datetimes is equal. */
        function dateEquals(from, to) {
            return from.year() == to.year() && from.month() == to.month() && from.date() == to.date();
        }
        $util.dateEquals = dateEquals;
        /** Merges the specified dates. */
        function mergeDates(target, dt) {
            // no valid target date -> clone
            if (!target || !target.isValid())
                return dt.clone();
            if (target.hour() == 0 && target.minute() == 0) {
                target.hour(dt.hour());
                target.minute(dt.minute());
            }
            return target;
        }
        $util.mergeDates = mergeDates;
        /** Merges the specified dates. */
        function mergeDatesStr(target, dt) {
            return mergeDates(moment(target), moment(dt));
        }
        $util.mergeDatesStr = mergeDatesStr;
        /** Ensures that the specified string starts with the prefix. */
        function ensureStartsWith(str, prefix) {
            if (str == null)
                str = "";
            if (str[0] == prefix)
                return str;
            return prefix + str;
        }
        $util.ensureStartsWith = ensureStartsWith;
        /** Gets the offset to the specified element.
         * anchor = top|middle
         */
        function getOffset(element, anchor) {
            if (anchor === void 0) { anchor = "top"; }
            element = (typeof element == "string" ? $(element) : element);
            if (element.length == 0)
                return null;
            var offset = element.offset().top;
            if (anchor == "middle")
                return offset - ($(window).height() - element.outerHeight()) / 2;
            return Math.max(offset, 0);
        }
        $util.getOffset = getOffset;
        /** Localizes the specified object propery (if possible). */
        function localize(obj, property) {
            if (!obj)
                return null;
            if (!property)
                property = "name";
            var val = obj[property + "_" + $alpbros.$cfg.lang];
            if (val === undefined)
                val = obj[property];
            return val;
        }
        $util.localize = localize;
        /** Returns the page wrapper of the specified element. */
        function getPage(el) {
            // get parent wrapper
            var pw = el;
            while (pw && !pw.hasClass("page"))
                pw = pw.parent();
            return pw.hasClass("page") ? pw.data("page") : null;
        }
        $util.getPage = getPage;
        /** Returns specified hash url. */
        function parseUrl(hash) {
            hash = hash.replace("#/", "").replace("#", "");
            var url = { hash: "#/" + hash };
            var parts = hash.split("?");
            // set stack
            var loc = (parts[0] || "").split("/");
            url.page = loc[0];
            if (url.page != "cmd" && !$alpbros.$pages.exists(url.page)) {
                url.dest = url.page;
                url.page = "main";
            }
            else
                url.dest = loc[loc.length - 1];
            // add args
            url.args = splitArgs(parts[1]);
            return url;
        }
        $util.parseUrl = parseUrl;
        /** Parses the specified hash args. */
        function splitArgs(argStr) {
            if (!argStr)
                return null;
            var args = {};
            $q(argStr.split("&")).ForEach(function (x) {
                var parts = x.split("=");
                args[parts[0]] = parts[1];
            });
            return args;
        }
        $util.splitArgs = splitArgs;
    })($util = $alpbros.$util || ($alpbros.$util = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    /** The app config. */
    var $cfg;
    (function ($cfg) {
        /** Initializes the app config. */
        function init(cfg) {
            $.extend(this, cfg);
            $alpbros.$res = cfg.res;
            localize();
            addPageSynonyms();
        }
        $cfg.init = init;
        /** Localizes the app config/data */
        function localize() {
            // localize event types
            $q($alpbros.MTBEventTypes).ForEach(function (x) { return $.extend(x.Value, $alpbros.$res.eventTypes[x.Key]); });
            // localize moment
            moment.locale($cfg.lang);
        }
        /** Adds all page synonyms. */
        function addPageSynonyms() {
            // add page synonyms
            $q($cfg.pages).ForEach(function (p) {
                $q(p.Value.synonyms).ForEach(function (s) {
                    $cfg.pages[s] = {
                        name: s,
                        preload: false,
                        synonyms: [],
                        synname: p.Key
                    };
                });
            });
        }
    })($cfg = $alpbros.$cfg || ($alpbros.$cfg = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    /** Specifies all event types. (Extended by resource!) */
    $alpbros.MTBEventTypes = {};
    $alpbros.MTBEventTypes[0] = $alpbros.MTBEventTypes["None"] = { id: 0, name: "None", description: "@@cfg", icon: "@@cfg" },
        $alpbros.MTBEventTypes[1] = $alpbros.MTBEventTypes["TechniqueTraining"] = { id: 1, name: "TechniqueTraining", description: "@@cfg", icon: "@@cfg" };
    $alpbros.MTBEventTypes[2] = $alpbros.MTBEventTypes["GuidedTour"] = { id: 2, name: "GuidedTour", description: "@@cfg", icon: "@@cfg" };
    $alpbros.MTBEventTypes[3] = $alpbros.MTBEventTypes["EBikeTour"] = { id: 3, name: "EBikeTour", description: "@@cfg", icon: "@@cfg" };
    $alpbros.MTBEventTypes[4] = $alpbros.MTBEventTypes["Camp"] = { id: 4, name: "Camp", description: "@@cfg", icon: "@@cfg" };
    $alpbros.MTBEventTypes[5] = $alpbros.MTBEventTypes["MechanicalTraining"] = { id: 5, name: "MechanicalTraining", description: "@@cfg", icon: "@@cfg" };
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    /** Defines a mtb event. */
    var MTBEvent = /** @class */ (function () {
        /** Initializes a new instance. */
        function MTBEvent(state) {
            this.state = state;
        }
        /** Gets the value for the specified property. */
        MTBEvent.prototype.get = function (prop, type) {
            switch (type) {
                case "date":
                    return $alpbros.$util.mergeDatesStr(this.state[prop], this.p(prop));
                case "localize":
                    return $alpbros.$util.localize(this.state, prop) || $alpbros.$util.localize(this.p(), prop);
                default:
                    return this.state[prop] || this.p(prop);
            }
        };
        /** Returns the specified property from the parent state or null if the event has no parent. */
        MTBEvent.prototype.p = function (prop) {
            var parent = this.parent();
            if (parent && parent.state)
                return prop ? parent.state[prop] : parent.state;
            return null;
        };
        /** Returns the event id. */
        MTBEvent.prototype.eventId = function () { return this.state.eventId; };
        /** Returns the parent event id. */
        MTBEvent.prototype.parentId = function () { return this.state.parentId; };
        /** Returns the parent event. */
        MTBEvent.prototype.parent = function () { return $alpbros.$data.eventMap.Get(this.state.parentId); };
        /** Returns the event from date/time. */
        MTBEvent.prototype.from = function () { return this.get("from", "date"); };
        /** Returns the event to date/time. */
        MTBEvent.prototype.to = function () { return this.get("to", "date"); };
        /** Returns the event type id */
        MTBEvent.prototype.typeId = function () { return this.get("type"); };
        /** Returns the event type. */
        MTBEvent.prototype.type = function () { return $alpbros.MTBEventTypes[this.typeId()]; };
        /** Returns the localized event name. */
        MTBEvent.prototype.name = function () { return this.get("name", "localize"); };
        /** Returns the german event name. */
        MTBEvent.prototype.name_de = function () { return this.get("name"); };
        /** Returns the english event name. */
        MTBEvent.prototype.name_en = function () { return this.get("name_en"); };
        /** Returns the localized event description. */
        MTBEvent.prototype.description = function () { return this.get("description", "localize"); };
        /** Returns the german event description. */
        MTBEvent.prototype.description_de = function () { return this.get("description"); };
        /** Returns the english event description. */
        MTBEvent.prototype.description_en = function () { return this.get("description_en"); };
        /** Returns the event price */
        MTBEvent.prototype.price = function () { return this.get("price"); };
        /** Returns whether the event is an Erlebniscard event. */
        MTBEvent.prototype.isErlebniscard = function () { return this.price() === MTBEvent.ErlebniscardPrice; };
        /** Returns the event level */
        MTBEvent.prototype.level = function () { return this.get("level"); };
        /** Returns the event image */
        MTBEvent.prototype.img = function () {
            var img = this.get("img");
            if (!img)
                img = this.type().name + ".jpg";
            if (img.substr(0, 5) == "data:")
                return img;
            return $alpbros.$cfg.root + $alpbros.$res.events.imgPath + img;
        };
        /** Returns the event template */
        MTBEvent.prototype.tpl = function () { return this.get("tpl"); };
        MTBEvent.ErlebniscardPrice = "Erlebniscard";
        return MTBEvent;
    }());
    $alpbros.MTBEvent = MTBEvent;
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $data;
    (function ($data) {
        /** Initializes all app data. */
        function init() {
            return $.when(
            // load events
            ($data.waitEvents = $alpbros.$ctx.db.event.q().orderBy("from asc").find())
                .then((function (res) {
                $data.events = res;
                $data.eventMap = $q(res).ToDictionary(function (x) { return x.state.eventId; }, function (x) { return x; });
            })));
        }
        $data.init = init;
    })($data = $alpbros.$data || ($alpbros.$data = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var loader;
        (function (loader_1) {
            var timeout;
            var delay = 300;
            var count = 0;
            var loader = $("#loader");
            /** Shows the loader. */
            function show() {
                if (timeout)
                    return;
                count++;
                $alpbros.$body.addClass("is-loading");
                timeout = setTimeout(function () {
                    loader.addClass("show");
                }, delay);
            }
            loader_1.show = show;
            /** Hides the loader. */
            function hide() {
                count = Math.max(0, count - 1);
                if (count > 0)
                    return;
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                loader.removeClass("show");
                $alpbros.$body.removeClass("is-loading");
            }
            loader_1.hide = hide;
            /** Shows/hides the loader. */
            function toggle(showLoader) {
                if (showLoader == undefined)
                    showLoader = !loader.hasClass("show");
                if (showLoader)
                    show();
                else
                    hide();
            }
            loader_1.toggle = toggle;
        })(loader = $ui.loader || ($ui.loader = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var section;
        (function (section) {
            /** Initializes all item lists. */
            function init(context, opt) {
                // activate sections on scroll
                var page = (context ? $alpbros.$util.getPage(context) : null) || $alpbros.$pages.get("main");
                var active = [];
                var scrollex = $ui.scrollex.init($((context ? "" : ".page ") + "> section, section > section", context), {
                    enter: !opt || !opt.setHashOnScroll ? null : function (sx, el) {
                        if ($alpbros.$body.hasClass("is-loading"))
                            return false;
                        // add active element with href attr
                        var href = el.attr("href");
                        if (href) {
                            if (active.indexOf(href) == -1)
                                active.push(href); // add to array
                            if (active.length == 1)
                                $alpbros.$app.setHash(active[0]); // set hash
                        }
                    },
                    leave: !opt || !opt.setHashOnScroll ? null : function (sx, el) {
                        if ($alpbros.$body.hasClass("is-loading"))
                            return false;
                        // remove active element with href attr
                        var href = el.attr("href");
                        if (href) {
                            // remove inactive element
                            var idx = active.indexOf(href);
                            if (idx > -1) {
                                active.splice(idx, 1); // remove from active array
                                if (active.length == 1)
                                    $alpbros.$app.setHash(active[0]); // set hash
                            }
                        }
                    }
                });
                // en-/disable scrollex on page load/hide
                page.pageCnt.on("pageload", function () { scrollex.options.enabled = true; });
                page.pageCnt.on("pagehide", function () { scrollex.options.enabled = false; });
            }
            section.init = init;
        })(section = $ui.section || ($ui.section = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var link;
        (function (link_1) {
            /** Initializes all links */
            function init(context) {
                $("a", context).each(function () {
                    initLink($(this));
                });
            }
            link_1.init = init;
            /** Initializes the specified link. */
            function initLink(link) {
                var href = link.attr("href");
                // no href -> no action
                if (!href)
                    return;
                // hash -> scroll to
                if (href[0] == "#")
                    link.off("click.href").on("click.href", function (e) {
                        // prevent default scrolling
                        if (e)
                            e.preventDefault();
                        // change hash
                        $alpbros.$app.hashChange(link.attr("href"), link.attr("anchor"), link.attr("speed"));
                    });
            }
        })(link = $ui.link || ($ui.link = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var img;
        (function (img_1) {
            /** Initializes all images. */
            function init(context) {
                // at the moment we only check for svg support
                // so we can return if svg is supported
                if (Modernizr.svgasimg)
                    return;
                // init images
                $("img.svg", context).each(function (i, el) {
                    // check svg compatibility
                    var img = $(el);
                    if (img.hasClass("svg"))
                        convertSvgToPng(img);
                });
            }
            img_1.init = init;
            /** Replaces .svg by .png of the specified image source. */
            function convertSvgToPng(img) {
                var src = img.attr("src");
                img.attr("src", src.replace(".svg", ".png"));
            }
        })(img = $ui.img || ($ui.img = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var items;
        (function (items) {
            var delay;
            /** Initializes all item lists. */
            function init(context) {
                // display items on scroll
                $ui.scrollex.init($(".items", context), { delay: delay })
                    .context.children()
                    .wrapInner('<div class="inner"></div>');
            }
            items.init = init;
        })(items = $ui.items || ($ui.items = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var events;
        (function (events) {
            /** Initializes the events table. */
            function init(context) {
                // wait for meta
                $alpbros.$data.waitEvents.done(function () {
                    // init all event-tables after meta has been loaded
                    $(".event-table table", context).each(function (i, el) {
                        appendEvents($(el));
                    });
                });
            }
            events.init = init;
            /** Appends all events. */
            function appendEvents(tbl) {
                $("tr.dummy", tbl).remove();
                tbl.prepend($q($alpbros.$data.events)
                    .Take($alpbros.$cfg.shownEvents)
                    .Select(function (ev) { return getEventRow(ev); })
                    .ToArray());
            }
            /** Returns an event row. */
            function getEventRow(event) {
                return $("<tr>").addClass("event")
                    .append($("<td>").text(event.from().format($alpbros.$res.upcoming.dateFormat)))
                    .append($("<td>")
                    .append($("<a>")) /*.attr("href", $cfg.root+event.url)*/.attr("target", "_blank").text(event.name()))
                    .append($("<td>").text(event.isErlebniscard() ? $alpbros.$res.events.erlebniscardPrice : event.price()));
            }
        })(events = $ui.events || ($ui.events = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var gallery;
        (function (gallery) {
            /** Initializes all galleries. */
            function init(context) {
                // basic init
                $ui.scrollex.init($(".gallery", context)
                    .wrapInner('<div class="inner"></div>')
                    .prepend(skel.vars.mobile ? "" : '<div class="forward"></div><div class="backward"></div>'), { delay: 50 })
                    .context.children(".inner")
                    .css("overflow-y", skel.vars.mobile ? "visible" : "hidden")
                    .css("overflow-x", skel.vars.mobile ? "scroll" : "hidden")
                    .scrollLeft(0);
                // initialize lighbox feature
                initLightbox(context);
            }
            gallery.init = init;
            /** Initializes the lightbox feature. */
            function initLightbox(context) {
                $(".gallery.lightbox", context).on("click", "a", function (e) {
                    var $a = $(this), $gallery = $a.parents(".gallery"), $modal = $gallery.children(".modal"), $modalImg = $modal.find("img"), href = $a.attr("href");
                    // not an image?
                    if (!href || !href.match(/\.(jpg|gif|png|mp4)$/))
                        return;
                    // prevent default.
                    e.preventDefault();
                    e.stopPropagation();
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // lock and remember current img
                    $modal[0]._locked = true;
                    $modal.data("cur", $a);
                    // set src, visible and focus
                    $modalImg.attr("src", href);
                    $modal.addClass("visible");
                    $modal.focus();
                    // disable bg scrolling
                    $alpbros.$main.addClass("no-scroll");
                    // delay and unlock.
                    setTimeout(function () { $modal[0]._locked = false; }, 300);
                })
                    .on("click", ".modal", function (e) {
                    var $modal = $(this), $modalImg = $modal.find("img");
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // already hidden?
                    if (!$modal.hasClass("visible"))
                        return;
                    // lock
                    $modal[0]._locked = true;
                    // clear visible, loaded.
                    $modal.removeClass("loaded");
                    // delay and hide.
                    setTimeout(function () {
                        $modal.removeClass("visible"); // hide
                        $alpbros.$main.removeClass("no-scroll"); // enable scrolling
                        setTimeout(function () {
                            // clear src, unlock and set focus to body
                            $modalImg.attr("src", "");
                            $modal[0]._locked = false;
                            $modal.removeData("cur"); // remove current img
                            $alpbros.$body.focus();
                        }, 175);
                    }, 125);
                })
                    // prev lick
                    .on("click", ".prev", function (e) {
                    var $modal = $(this).parents(".gallery").children(".modal");
                    // get current
                    var $cur = $modal.data("cur");
                    if (!$cur)
                        return;
                    // get prev
                    var $prev = $cur.parent().prev().find("a");
                    // take last if we are at the top
                    if (!$prev || !$prev.length)
                        $prev = $cur.parent().parent().children().last().find("a");
                    // check
                    if (!$prev || !$prev.length)
                        return;
                    // load prev
                    $prev.trigger("click");
                })
                    // next click
                    .on("click", ".next", function (e) {
                    var $modal = $(this).parents(".gallery").children(".modal");
                    // get current
                    var $cur = $modal.data("cur");
                    if (!$cur)
                        return;
                    // get next
                    var $next = $cur.parent().next().find("a");
                    // take first if we are at the end
                    if (!$next || !$next.length)
                        $next = $cur.parent().parent().children().first().find("a");
                    // check
                    if (!$next || !$next.length)
                        return;
                    // load next
                    $next.trigger("click");
                })
                    // keyboard listener
                    .on("keydown", ".modal", function (e) {
                    var $modal = $(this);
                    switch (e.keyCode) {
                        // escape, hide lightbox
                        case 27:
                            $modal.trigger("click");
                            break;
                        // left, prev img
                        case 37:
                            $modal.parent().find(".prev").trigger("click");
                            break;
                        // right, next img
                        case 39:
                            $modal.parent().find(".next").trigger("click");
                            break;
                    }
                })
                    .prepend('<div class="modal" tabIndex="-1">'
                    + '<a class="prev icon style2 fa-angle-left"></a>'
                    + '<div class="inner"><img src="" /></div>'
                    + '<a class="next icon style2 fa-angle-right"></a>'
                    + '</div>')
                    .find("img")
                    .on("load", function (e) {
                    var $modalImg = $(this), $modal = $modalImg.parents(".modal");
                    setTimeout(function () {
                        // no longer visible?
                        if (!$modal.hasClass("visible"))
                            return;
                        // set loaded.
                        $modal.addClass("loaded");
                    }, 275);
                });
            }
        })(gallery = $ui.gallery || ($ui.gallery = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var map;
        (function (map_1) {
            var apikey = "AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
            var currentIdx = 0;
            var maps = [];
            var apiAdded;
            /** Initializes all maps. */
            function init(context) {
                $(".map", context).q().ForEach(function (x) { return maps.push(createMap(x)); });
            }
            map_1.init = init;
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
                // add api only once
                if (!apiAdded) {
                    cnt.after('<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + apikey + '&callback=initMap' + currentIdx + '"></script>');
                    apiAdded = true;
                }
                else
                    initMap(map);
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
        })(map = $ui.map || ($ui.map = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
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
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var menu;
        (function (menu_1) {
            var mbtn = $("#menu-btn");
            var menu = $("#menu");
            /** Initializes the menu. */
            function init() {
                // init links
                $ui.link.init(menu);
                // toggle menu on menu button click
                mbtn.click(function () {
                    if ($alpbros.$main.hasClass("menu-opened"))
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
                $alpbros.$main.addClass("menu-opened").addClass("no-scroll");
                menu.addClass("opened");
            }
            menu_1.open = open;
            /** Closes the menu. */
            function close() {
                mbtn.addClass("fa-bars").removeClass("fa-close");
                $alpbros.$main.removeClass("menu-opened").removeClass("no-scroll");
                menu.removeClass("opened");
            }
            menu_1.close = close;
        })(menu = $ui.menu || ($ui.menu = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        /** JQuery timeline extension */
        $.fn.timeline = function () {
            return this.data("timeline");
        };
        var timeline;
        (function (timeline) {
            function init(context) {
                $(".timeline", context).each(function (i, el) {
                    new Timeline($(el));
                });
            }
            timeline.init = init;
        })(timeline = $ui.timeline || ($ui.timeline = {}));
        var Timeline = /** @class */ (function () {
            /** Initializes a new instance of Timeline */
            function Timeline(el) {
                this.element = el.data("timeline", this);
                this.page = $alpbros.$util.getPage(this.element);
                this.initBlocks();
                this.initScrolling();
                $ui.link.init(el);
            }
            Timeline.prototype.initScrolling = function () {
                var _this = this;
                this.hideBlocks();
                $alpbros.$window.on("scroll", function () {
                    if (!_this || !_this.hasBlocks() || !_this.pageIsActive())
                        return;
                    if (!window.requestAnimationFrame)
                        setTimeout(function () { _this.showBlocks(); }, 100);
                    else
                        window.requestAnimationFrame(function () { _this.showBlocks(); });
                });
            };
            /** Returns whether the timeline has blocks. */
            Timeline.prototype.hasBlocks = function () {
                return this.blocks && this.blocks.length > 0;
            };
            /** Returns whether the timeline's page is active. */
            Timeline.prototype.pageIsActive = function () {
                return this.page && this.page.pageCnt.hasClass("current");
            };
            /** Initializes the blocks. */
            Timeline.prototype.initBlocks = function () {
                this.blocks = $('.timeline-block', this.element);
            };
            /** Hides timeline blocks which are not on the viewport. */
            Timeline.prototype.hideBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    _this.hideBlock($(el));
                });
            };
            /** Shows timeline blocks which are on or near the viewport. */
            Timeline.prototype.showBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    _this.showBlock($(el));
                });
            };
            /** Refreshes (show/hides) all blocks. */
            Timeline.prototype.refreshBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    var block = $(el);
                    _this.hideBlock(block);
                    _this.showBlock(block);
                });
            };
            Timeline.prototype.hideBlock = function (block) {
                if (block.offset().top > $alpbros.$window.scrollTop() + $alpbros.$window.height() * Timeline.offset)
                    block.find('.timeline-img, .timeline-content').addClass('is-hidden');
            };
            Timeline.prototype.showBlock = function (block) {
                if (block.offset().top <= $alpbros.$window.scrollTop() + $alpbros.$window.height() * Timeline.offset && block.find('.timeline-img').hasClass('is-hidden'))
                    block.find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
            };
            /** Offset for show/hide blocks; */
            Timeline.offset = 0.8;
            return Timeline;
        }());
        $ui.Timeline = Timeline;
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        var scrollex;
        (function (scrollex_1) {
            /** Initializes a new scrollex element. */
            function init(context, opt) {
                return new Scrollex(context, opt);
            }
            scrollex_1.init = init;
            /** Adds new scrolling events to change elements on scrolling. */
            var Scrollex = /** @class */ (function () {
                /** Initializes a new scrollex element. */
                function Scrollex(context, opt) {
                    var _this = this;
                    // set element
                    this.context = context;
                    this.context.each(function (i, el) { $(el).data("scrollex", _this); });
                    // extend default options
                    var t = this;
                    var init = opt.initialize, terminate = opt.terminate, enter = opt.enter, leave = opt.leave;
                    this.options = opt = $.extend({}, Scrollex.defaultOptions, opt, {
                        initialize: function () { t.initialize($(this), init); },
                        terminate: function () { t.terminate($(this), terminate); },
                        enter: function () { t.enter($(this), enter); },
                        leave: function () { t.leave($(this), leave); }
                    });
                    // execute jquery scrollex plugin
                    this.context.scrollex(opt);
                }
                /** Triggered when scrollex is called on an element. */
                Scrollex.prototype.initialize = function (el, init) {
                    if (!this.options.enabled || init && init(this, el) === false)
                        return;
                    el.addClass(this.options.inactiveClass);
                };
                /** Triggered when unscrollex is called on an element. */
                Scrollex.prototype.terminate = function (el, terminate) {
                    if (!this.options.enabled || terminate && terminate(this, el) === false)
                        return;
                    el.removeClass(this.options.inactiveClass);
                };
                /** Triggered when the viewport enters an element's contact area. */
                Scrollex.prototype.enter = function (el, enter) {
                    if (!this.options.enabled || enter && enter(this, el) === false)
                        return;
                    // set active
                    el.removeClass(this.options.inactiveClass);
                };
                /** Triggered when the viewport leaves an element's contact area. */
                Scrollex.prototype.leave = function (el, leave) {
                    if (!this.options.enabled || leave && leave(this, el) === false)
                        return;
                    // set inactive
                    var opt = this.options;
                    if (opt.bidirectional == true || opt.bidirectional && el.hasClass(opt.bidirectional))
                        el.addClass(opt.inactiveClass);
                };
                /** Default options. */
                Scrollex.defaultOptions = {
                    enabled: true,
                    top: "30vh",
                    bottom: "30vh",
                    inactiveClass: "is-inactive",
                    bidirectional: "onscroll-bidirectional"
                };
                return Scrollex;
            }());
            scrollex_1.Scrollex = Scrollex;
        })(scrollex = $ui.scrollex || ($ui.scrollex = {}));
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ui;
    (function ($ui) {
        $ui.$scrollCnt = $("body,html");
        $ui.$backBtn = $("#back-btn");
        /** Initializes the UI. */
        function init(context, opt) {
            // init ui parts
            fixObjectFit(context); // fix object fit
            $ui.section.init(context, opt);
            $ui.img.init(context);
            $ui.items.init(context); // init item lists
            $ui.events.init(context); // init events
            $ui.gallery.init(context); // init gallery
            $ui.timeline.init(context); // init timeline
            $ui.map.init(context); // google maps
            $ui.link.init(context); // init links and smooth scrolling, do this last because the other functions may create/change some link
            // trigger scroll event to ensure scrollex works fine
            $ui.$scrollCnt.trigger("scroll");
        }
        $ui.init = init;
        /** Init common ui parts, should be called only once. */
        function initCommon() {
            fixIEFlexbox(); // fix IE flexbox min-height bug
            initBackBtn(); // init back button
            initLangBtn(); // hide language button on scroll
            $ui.menu.init(); // menu
        }
        $ui.initCommon = initCommon;
        /** Scrolls to the specified element.
         * anchor: top|middle
         * speed: slow|normal|fast|immediate
         */
        function scrollTo(url, anchor, speed, popstate, wait) {
            // load page
            if (!wait)
                wait = $.Deferred();
            var pageName = (url.page || "main");
            if ($alpbros.$pages.exists(pageName + "-" + url.dest))
                pageName += "-" + url.dest;
            $alpbros.$pages.load(pageName).done(function (page) {
                // get destination element
                var dest = url.dest ? $("#" + url.dest) : null;
                if (!dest || !dest.length)
                    dest = page.pageCnt;
                // get anchor and speed
                if (!anchor)
                    anchor = dest.attr("anchor") || "top";
                if (!speed)
                    speed = dest.attr("speed") || "normal";
                // if popstate try get offset from page
                var offset;
                if (popstate)
                    offset = page.remOffset();
                // otherwise get offset from dest
                if (offset == undefined)
                    offset = $alpbros.$util.getOffset(dest, anchor);
                // scroll to offset
                scrollToPos(offset, anchor, speed, wait);
            });
            return wait.promise();
        }
        $ui.scrollTo = scrollTo;
        /** Scrolls to the specified position. */
        function scrollToPos(offset, anchor, speed, wait) {
            if (anchor === void 0) { anchor = "top"; }
            if (speed === void 0) { speed = "normal"; }
            if (!wait)
                wait = $.Deferred();
            // scroll immediate?
            if (speed == "immediate") {
                $ui.$scrollCnt.stop().scrollTop(offset);
                setTimeout(function () {
                    wait.resolve();
                }, 100);
            }
            else // scroll smooth
             {
                var duration = 1000; // normal speed
                if (speed == "slow")
                    duration = 2000;
                else if (speed == "fast")
                    duration = 300;
                $ui.$scrollCnt.stop().animate({ scrollTop: offset }, duration, "swing", function () {
                    wait.resolve();
                });
            }
            return wait.promise();
        }
        $ui.scrollToPos = scrollToPos;
        /** Initializes the back button. */
        function initBackBtn() {
            $ui.$backBtn.click(function (e) {
                // prevent default scrolling
                if (e)
                    e.preventDefault();
                // go back
                $alpbros.$app.back();
            });
        }
        /** Initializes the language button. */
        function initLangBtn() {
            var langBtn = $("#lang-btn");
            var check = function (e) {
                var winHeight = $alpbros.$window.height();
                var scrollHeight = $alpbros.$window.scrollTop();
                langBtn.toggleClass("hidden", scrollHeight > (winHeight / 2) || $alpbros.$pages.current && $alpbros.$pages.current.pageCnt.hasClass("no-lang-btn"));
            };
            $alpbros.$window.scroll(check);
            $alpbros.$window.resize(check);
            check();
        }
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
        /** Fixes object fix. */
        function fixObjectFit(context) {
            if (skel.canUse('object-fit'))
                return;
            $('.banner .image, .spotlight .image', context).each(function (idx, el) {
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
    })($ui = $alpbros.$ui || ($alpbros.$ui = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ctx;
    (function ($ctx) {
        var db;
        (function (db) {
            /** Specifies a database table. */
            var DBTable = /** @class */ (function () {
                /** Initializes a new instance of DBTable. */
                function DBTable(name, parse) {
                    this.name = name;
                    this.parse = parse;
                }
                /** Starts a new query. */
                DBTable.prototype.q = function () {
                    return new DBQuery(this);
                };
                return DBTable;
            }());
            db.DBTable = DBTable;
            /** Specifies a database call. */
            var DBQuery = /** @class */ (function () {
                /** Initializes a new instance of DBCall. */
                function DBQuery(table) {
                    this._table = table;
                    this._url = "/" + $alpbros.$cfg.ctx.db + "/_table/" + table.name;
                }
                /** Selects the specified fields. */
                DBQuery.prototype.select = function (fields) {
                    this._select = fields;
                    return this;
                };
                /** Specifies a filter. */
                DBQuery.prototype.where = function (filter) {
                    this._where = filter;
                    return this;
                };
                /** Specifies a relation. */
                DBQuery.prototype.related = function (fields) {
                    this._related = fields;
                    return this;
                };
                /** Specifies to order the result by the given fields. */
                DBQuery.prototype.orderBy = function (fields) {
                    this._orderBy = fields;
                    return this;
                };
                /** Specifies to group the result by the fiven fields. */
                DBQuery.prototype.groupBy = function (fields) {
                    this._groupBy = fields;
                    return this;
                };
                /** Limits the amount of records returned. */
                DBQuery.prototype.limit = function (limit) {
                    this._limit = limit;
                    return this;
                };
                /** Specifies an offset for the result records. */
                DBQuery.prototype.offset = function (offset) {
                    this._offset = offset;
                    return this;
                };
                /** Parses a single record. */
                DBQuery.prototype.parseSingle = function (res) {
                    if (!res)
                        return null;
                    else if (this._table.parse)
                        return this._table.parse(res);
                    else
                        return res;
                };
                /** Parses multiple records. */
                DBQuery.prototype.parseMany = function (res) {
                    var _this = this;
                    if (!res || !res.resource)
                        return [];
                    if (this._table.parse)
                        return $q(res.resource).Select(function (x) { return _this._table.parse(x); }).ToArray();
                    else
                        return res.resource;
                };
                /** Retrieves a single records. */
                DBQuery.prototype.get = function (id) {
                    var _this = this;
                    var data = {};
                    if (this._select)
                        data["fields"] = this._select;
                    return $ctx.get(this._url + "/" + id, data).then(function (res) { return _this.parseSingle(res); });
                };
                /** Retrieves multiple records. */
                DBQuery.prototype.find = function () {
                    var _this = this;
                    var data = {};
                    if (this._select)
                        data["fields"] = this._select;
                    if (this._where)
                        data["filter"] = this._where;
                    if (this._orderBy)
                        data["order"] = this._orderBy;
                    if (this._groupBy)
                        data["group"] = this._groupBy;
                    if (this._limit)
                        data["limit"] = this._limit;
                    if (this._offset)
                        data["offset"] = this._offset;
                    if (this._related)
                        data["related"] = this._related;
                    return $ctx.get(this._url, data).then(function (res) { return _this.parseMany(res); });
                };
                return DBQuery;
            }());
            db.DBQuery = DBQuery;
            // init tables
            db.event = new DBTable("event", function (ev) { return new $alpbros.MTBEvent(ev); });
        })(db = $ctx.db || ($ctx.db = {}));
    })($ctx = $alpbros.$ctx || ($alpbros.$ctx = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ctx;
    (function ($ctx) {
        var session;
        (function (session_1) {
            var sessionCookie = "alpbros_session";
            /** The current session. */
            session_1.current = null;
            /** Returns the session token. */
            function token() {
                return (session_1.current ? session_1.current.session_token : null) || Cookies.get(sessionCookie);
            }
            session_1.token = token;
            /** Signs in the specified user. */
            function signin(email, pwd, duration) {
                if (duration === void 0) { duration = 0; }
                return $ctx.post("/user/session", { email: email, password: pwd, duration: duration || 0 })
                    .then(function (session) {
                    // set session
                    return setSession(session);
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.signin = signin;
            /** Signs in the specified user by hash. */
            function hashauth(hash) {
                return $ctx.post("/hashauth", { hash: hash })
                    .then(function (session) {
                    // set session
                    return setSession(session);
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.hashauth = hashauth;
            /** Signs out the current user. */
            function signout() {
                if (!session_1.current || !session_1.current.session_token)
                    return $.Deferred().resolve().promise();
                return $ctx.del("/user/session") //{ "session_token": current.session_token })
                    .then(function () {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.signout = signout;
            /** Refreshes the current session. */
            function refresh() {
                // try get session from cookie
                var token = session_1.current ? session_1.current.session_token : null;
                if (!token)
                    token = Cookies.get(sessionCookie);
                if (!token)
                    return $.Deferred().reject().promise();
                return $ctx.put("/user/session") //, { "session_token": token })
                    .then(function (session) {
                    // refresh session
                    return setSession(session);
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.refresh = refresh;
            /** Sets the current session and cookie. */
            function setSession(session) {
                session_1.current = session;
                if (session_1.current)
                    Cookies.set(sessionCookie, session_1.current.session_token, { expires: 1 });
                else
                    Cookies.remove(sessionCookie);
                return session_1.current;
            }
        })(session = $ctx.session || ($ctx.session = {}));
    })($ctx = $alpbros.$ctx || ($alpbros.$ctx = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $ctx;
    (function ($ctx) {
        /** Performs an API request. */
        function call(verb, url, data) {
            if (data && (verb == "POST" || verb == "PUT"))
                data = JSON.stringify(data);
            return $.ajax({
                type: verb,
                url: $alpbros.$cfg.ctx.baseurl + url,
                data: data || {},
                accepts: { json: "application/json" },
                contentType: "application/json",
                headers: {
                    "X-DreamFactory-API-Key": $alpbros.$cfg.ctx.apikey,
                    "X-DreamFactory-Session-Token": $ctx.session.token()
                }
            });
        }
        $ctx.call = call;
        /** Checks the specified url. */
        function checkUrl(url) {
            return url.replace("/db", "/" + $alpbros.$cfg.ctx.db);
        }
        /** Performs an API GET request. */
        function get(url, data) {
            return call("GET", url, data);
        }
        $ctx.get = get;
        /** Performs an API POST request. */
        function post(url, data) {
            return call("POST", url, data);
        }
        $ctx.post = post;
        /** Performs an API PUT request. */
        function put(url, data) {
            return call("PUT", url, data);
        }
        $ctx.put = put;
        /** Performs an API DELETE request. */
        function del(url, data) {
            return call("DELETE", url, data);
        }
        $ctx.del = del;
    })($ctx = $alpbros.$ctx || ($alpbros.$ctx = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Defines a page. */
        var Page = /** @class */ (function () {
            /** Initializes the page. */
            function Page(name, pageCnt, wait) {
                this.name = name;
                this.pageCnt = pageCnt;
                this.pageCnt.data("page", this);
            }
            /** Returns whether the page is the current visible one. */
            Page.prototype.isCurrent = function () {
                return this.pageCnt.hasClass("current");
            };
            /** Returns whether the page is hidden. */
            Page.prototype.isHidden = function () {
                return this.pageCnt.hasClass("hidden");
            };
            /** Returns the default back url for the current page. */
            Page.prototype.defaultBack = function () {
                return this.pageCnt.attr("back");
            };
            Page.prototype.remOffset = function (offset) {
                if (offset === null)
                    this.pageCnt.removeAttr("offset");
                else if (offset !== undefined)
                    this.pageCnt.attr("offset", offset);
                else {
                    var attr = this.pageCnt.attr("offset");
                    if (attr != null)
                        return parseInt(attr);
                    return null;
                }
            };
            /** Called when the page gets loaded. */
            Page.prototype.load = function (wait) {
                if (wait)
                    wait.resolve(this);
            };
            return Page;
        }());
        $pages.Page = Page;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageMain = /** @class */ (function (_super) {
            __extends(PageMain, _super);
            /** Initializes the page */
            function PageMain(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $alpbros.$ui.initCommon();
                $alpbros.$ui.init(pageCnt, { setHashOnScroll: Modernizr.history });
                // ready
                wait.resolve(_this);
                return _this;
            }
            return PageMain;
        }($pages.Page));
        $pages.PageMain = PageMain;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Timeline page. */
        var PageEvents = /** @class */ (function (_super) {
            __extends(PageEvents, _super);
            /** Initializes the page */
            function PageEvents(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // get timeline element
                _this.timelineCnt = $("#event-timeline");
                // wait for meta/events
                $alpbros.$data.waitEvents.done(function () {
                    // append events
                    _this.appendEvents();
                    // init ui, search form and timeline
                    $alpbros.$ui.init(pageCnt);
                    _this.initForm();
                    _this.timeline = _this.timelineCnt.timeline();
                    _this.filterTimeline();
                    // ready
                    wait.resolve(_this);
                })
                    .fail(function () { wait.reject(); });
                return _this;
            }
            /** Loads the timeline page */
            PageEvents.prototype.load = function (wait) {
                // init blocks on first load
                if (!this.timeline.hasBlocks())
                    this.timeline.initBlocks();
                // show/hide blocks
                this.timeline.refreshBlocks();
                // loaded
                wait.resolve(this);
            };
            /** Initializes the event search form. */
            PageEvents.prototype.initForm = function () {
                var _this = this;
                // init from date
                $("input#event-from-date").val((new Date()).toISOString().substr(0, 10));
                // init tour select
                var typeSelect = $("select#event-type");
                $q($alpbros.MTBEventTypes).ForEach(function (x) {
                    var type = x.Value;
                    typeSelect.append('<option value="' + type.id + '">' + type.description + '</option>');
                });
                // set change event
                $("input,select").change(function () { return _this.filterTimeline(); });
            };
            /** Appends all events. */
            PageEvents.prototype.appendEvents = function () {
                var _this = this;
                this.timelineItems = $q($alpbros.$data.events).Select(function (ev) { return ({
                    event: ev,
                    item: _this.getTimelineItem(ev)
                }); }).ToArray();
                this.timelineCnt.append($q(this.timelineItems).Select(function (x, i) { return x.item.toggleClass("even", i % 2 != 0); }).ToArray());
            };
            /** Filters the events by the criteria specified in the search form. */
            PageEvents.prototype.filterTimeline = function () {
                var v;
                var fromDate = (v = $("#event-from-date").val()) ? moment(v) : null;
                var toDate = (v = $("#event-to-date").val()) ? moment(v) : null;
                var type = $("#event-type").val();
                var level = $alpbros.MTBLevel.Everyone
                    | ($("#event-level-beginner").is(":checked") ? $alpbros.MTBLevel.Beginner : $alpbros.MTBLevel.Everyone)
                    | ($("#event-level-advanced").is(":checked") ? $alpbros.MTBLevel.Advanced : $alpbros.MTBLevel.Everyone);
                var visible = 0;
                $q(this.timelineItems).ForEach(function (x) {
                    var ev = x.event;
                    var hide = fromDate && ev.from() < fromDate
                        || toDate && ev.to() > toDate
                        || type && type != "all" && ev.typeId() != type
                        || level < $alpbros.MTBLevel.All && ev.level() != $alpbros.MTBLevel.Everyone && (ev.level() & level) == 0;
                    x.item.toggleClass("hidden", hide);
                    if (!hide) {
                        x.item.toggleClass("even", visible % 2 != 0).toggleClass("first-child", visible == 0);
                        visible++;
                    }
                });
                // show/hide blocks
                this.timeline.refreshBlocks();
            };
            /** Returns a timeline item. */
            PageEvents.prototype.getTimelineItem = function (event) {
                var price = event.isErlebniscard() ? $alpbros.$res.events.erlebniscardPrice : event.price();
                var eventUrl = "#/event?id=" + event.eventId();
                return $('<div class="timeline-block" eventId="' + event.eventId() + '">' +
                    '<div class="timeline-img bg-color-' + this.getLevelColor(event) + '" title="' + event.type().name + '">' +
                    '<span class="icon style2 major ' + event.type().icon + '"></span>' +
                    '</div>' +
                    '<div class="timeline-content">' +
                    '<h3>' + event.name() + '<br /><code><span class="icon fa-money"></span> ' + price + '</code></h3>' +
                    '<p>' +
                    '<img src="' + event.img() + '" />' +
                    '<strong>' +
                    $alpbros.$util.formatFromTo(event.from(), event.to(), $alpbros.$res.events.dateFormat, $alpbros.$res.events.multiDayFormat) +
                    "<br />" + $alpbros.$res.events.level + ": " + $alpbros.$res.level[$alpbros.MTBLevel[event.level()]] +
                    '</strong><br /><br />' +
                    event.description() +
                    '</p><br style="clear: both;" />' +
                    '<a href="' + eventUrl + '" class="button special icon fa-pencil">Details & Anmeldung</a>' +
                    '<span class="date">' + $alpbros.$util.formatDate(event.from(), $alpbros.$res.events.fromFormat) + '</span>' +
                    '</div>' +
                    '</div>').data("event", event);
            };
            /** Returns the color for the specified event's level. */
            PageEvents.prototype.getLevelColor = function (event) {
                switch (event.level()) {
                    case $alpbros.MTBLevel.Beginner: return "green";
                    case $alpbros.MTBLevel.Advanced: return "orange";
                    default: return "blue";
                }
            };
            return PageEvents;
        }($pages.Page));
        $pages.PageEvents = PageEvents;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Event page. */
        var PageEvent = /** @class */ (function (_super) {
            __extends(PageEvent, _super);
            /** Initializes the page */
            function PageEvent(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // wait for meta/events
                $alpbros.$data.waitEvents.done(function () {
                    // init ui
                    $alpbros.$ui.init(pageCnt);
                    // ready
                    wait.resolve(_this);
                });
                return _this;
            }
            /** Called when the page gets loaded. */
            PageEvent.prototype.load = function (wait) {
                // get url args
                var args = $alpbros.$url.args || {};
                var eventId = args.id;
                // check if eventId and date is set
                if (!eventId) {
                    if (wait)
                        wait.reject("Missing eventId and/or date!");
                    return;
                }
                // get event
                var event = $q($alpbros.$data.events).FirstOrDefault(null, function (x) { return x.eventId() == eventId; });
                if (!event) {
                    if (wait)
                        wait.reject("Event not found for '" + $alpbros.$url.hash + "'!");
                    return;
                }
                // show command and tpl, hide other sections
                var tplName = args.tpl || event.tpl() || "default";
                var tpl = $(">section.common, >section." + tplName, this.pageCnt).removeClass("hidden");
                $(">section:not(.common, ." + tplName + ")", this.pageCnt).addClass("hidden");
                // toggle erlebniscard fields
                this.pageCnt.toggleClass("erlebniscard", event.price() == "Erlebniscard");
                // set event name, price
                $(".event-name", tpl).text(event.name());
                $(".event-price-text", tpl).text(event.price());
                $(".event-info", tpl).html($alpbros.$util.formatFromTo(event.from(), event.to(), $alpbros.$res.events.dateFormat, $alpbros.$res.events.multiDayFormat) +
                    "<br />" + $alpbros.$res.events.level + ": " + $alpbros.$res.level[$alpbros.MTBLevel[event.level()]]);
                $(".event-text", tpl).html(event.description());
                // ready
                if (wait)
                    wait.resolve(this);
            };
            return PageEvent;
        }($pages.Page));
        $pages.PageEvent = PageEvent;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Event page. */
        var PageEventEdit = /** @class */ (function (_super) {
            __extends(PageEventEdit, _super);
            /** Initializes the page */
            function PageEventEdit(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init input fields
                var inputs = ["type", "level", "name-de", "name-en",
                    "short-descr-de", "short-descr-en", "descr-de", "descr-en",
                    "requirements-de", "requirements-en", "from", "to"];
                $q(inputs).ForEach(function (x) { _this[x.replace(/-/g, "_")] = _this.input(x); });
                // init images
                _this.img = $(".event-img", pageCnt).click(function () {
                    $(".event-img.selected").removeClass("selected");
                    $(this).addClass("selected");
                });
                // init dates table
                _this.datesTbl = $("table.dates", pageCnt);
                $("a.add-date", _this.datesTbl).click(function () { return _this.addDate(); });
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageEventEdit.prototype.load = function (wait) {
                //set page mode
                this.pageCnt.attr("mode", $alpbros.$url.dest || "edit");
                // init dates
                this.dates = [];
                // ready
                if (wait)
                    wait.resolve(this);
            };
            /** Adds the date from the event date row. */
            PageEventEdit.prototype.addDate = function () {
                var from = moment(this.from.val());
                var to = moment(this.to.val());
                if (!from.isValid())
                    return alert("Invalid from date!");
                if (!to.isValid())
                    return alert("Invalid to date!");
                if ($q(this.dates).Any(function (x) { return x.from.isSame(from) && x.to.isSame(to); }))
                    return alert("Duplicate date");
                this.dates.push({
                    from: from,
                    to: to
                });
                this.refreshDatesTbl();
            };
            /** Refreshes the dates table. */
            PageEventEdit.prototype.refreshDatesTbl = function () {
                var _this = this;
                var tbody = $("tbody", this.datesTbl).empty();
                $q(this.dates).OrderBy(function (dt) { return dt.from; }).ForEach(function (dt) {
                    tbody.append(_this.getDateRow(dt));
                });
            };
            PageEventEdit.prototype.getDateRow = function (date) {
                var _this = this;
                var row;
                return (row = $("<tr>")).data("date", date).append(
                // from date
                $("<td>").text(date.from.format($alpbros.$res.event.edit.dateFormat)), 
                // to date
                $("<td>").text(date.to.format($alpbros.$res.event.edit.dateFormat)), 
                // buttons
                $("<td>").append(
                // repeat next week button
                $("<a>").addClass("icon style2 fa-repeat").attr("title", $alpbros.$res.event.edit.repeat).click(function () {
                    var repeated = {
                        from: date.from.clone().add(7, "days"),
                        to: date.to.clone().add(7, "days")
                    };
                    _this.dates.push(repeated);
                    _this.refreshDatesTbl();
                }), 
                // remove button
                $("<a>").addClass("icon style2 fa-minus").click(function () {
                    // remove date
                    _this.dates = $q(_this.dates).Where(function (x) { return x !== date; }).ToArray();
                    // refresh dates table
                    _this.refreshDatesTbl();
                })));
            };
            /** Gets the specified input element by name. */
            PageEventEdit.prototype.input = function (name) {
                return $("input[name='event-" + name + "']", this.pageCnt);
            };
            return PageEventEdit;
        }($pages.Page));
        $pages.PageEventEdit = PageEventEdit;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageSignin = /** @class */ (function (_super) {
            __extends(PageSignin, _super);
            /** Initializes the page */
            function PageSignin(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $alpbros.$ui.init(pageCnt);
                _this.signInBtn = $("#signin-btn", pageCnt).click(function (e) {
                    if (e)
                        e.preventDefault();
                    _this.signIn();
                });
                _this.email = $("#signin-email", _this.pageCnt);
                _this.pwd = $("#signin-pwd", _this.pageCnt);
                _this.errorLbl = $("#signin-error", _this.pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            PageSignin.prototype.signIn = function () {
                var _this = this;
                // signin
                $alpbros.$ui.loader.show();
                $alpbros.$cmd.exec("signin", {
                    email: this.email.val(),
                    pwd: this.pwd.val(),
                    "return": $alpbros.$url.args ? $alpbros.$url.args["return"] : null
                })
                    .always(function () {
                    // hide loader and empty form
                    $alpbros.$ui.loader.hide();
                    _this.email.val("");
                    _this.pwd.val("");
                })
                    .done(function () {
                    // hide error
                    _this.errorLbl.addClass("hidden");
                })
                    .fail(function (jqXHR, status, err) {
                    // set error
                    _this.errorLbl.text(err).removeClass("hidden");
                });
            };
            return PageSignin;
        }($pages.Page));
        $pages.PageSignin = PageSignin;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageAdmin = /** @class */ (function (_super) {
            __extends(PageAdmin, _super);
            /** Initializes the page */
            function PageAdmin(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $alpbros.$ui.init(pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageAdmin.prototype.load = function (wait) {
                // check if user logged in and admin
                var session = $alpbros.$ctx.session.current;
                if (!session || session.role_id != $alpbros.Roles.Admin) {
                    // redirect to signin
                    wait.reject({ redirect: "#/signin?return=/admin" });
                    return;
                }
                // ready
                wait.resolve(this);
            };
            return PageAdmin;
        }($pages.Page));
        $pages.PageAdmin = PageAdmin;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $pages;
    (function ($pages) {
        var waiting = {};
        var pages = {};
        /** Loads the specified page. */
        function load(name, preload) {
            // check if page exists
            var pageInfo = $alpbros.$cfg.pages[name];
            if (pageInfo == null)
                return $.Deferred().reject("Missing page " + name).promise();
            // check if page is synonym
            if (pageInfo.synname)
                return load(pageInfo.synname, preload);
            // already waiting?
            var wait = waiting[name];
            // not already waiting
            if (!wait) {
                // create promise
                var wait = $.Deferred().fail(function (err) { fail(err, name, preload); });
                // get page
                var page = get(name);
                var ctor;
                // does page and ctor exist?
                if (!page && !(ctor = getCtor(name)))
                    return wait.reject().promise(); // page and ctor does not exist -> reject
                else if (page)
                    wait.resolve(page); // page exists -> page load
                else // page does not exist -> init page befor load
                 {
                    if (!preload)
                        $alpbros.$ui.loader.show();
                    getPageCnt(name).then(function (pageCnt) {
                        // create page
                        page = pages[name] = new ctor(name, pageCnt, wait);
                        if (ctor == $pages["Page"])
                            wait.resolve(page); // default page -> resolve
                    }, function () { wait.reject(); });
                }
            }
            // load page
            // it's necessary to remember the promise to prevent duplicate loading while preloading
            return (waiting[name] = wait.then(function (page) {
                if (!page.load || preload)
                    return page;
                var waitLoad = $.Deferred();
                page.load(waitLoad);
                return waitLoad;
            })
                .then(function (page) {
                // init current page on app start, should be main page
                if (!$pages.current)
                    $pages.current = page;
                // hide loader and set current page if not preloading
                if (!preload) {
                    $alpbros.$ui.loader.hide();
                    if ($pages.current != page) {
                        // hide old current
                        if ($pages.current) {
                            $pages.current.pageCnt.removeClass("current").addClass("hidden");
                            $pages.current.pageCnt.trigger("pagehide");
                        }
                        // set new current
                        ($pages.current = page).pageCnt.addClass("current").removeClass("hidden");
                        $pages.current.pageCnt.trigger("pageload");
                    }
                    // set back btn
                    $alpbros.$ui.$backBtn.toggleClass("hidden", $pages.current == get("main"));
                }
                return page;
            })).fail(function (err) { fail(err, name, preload); }); // catch fail
        }
        $pages.load = load;
        /** Preloads the specified page. */
        function preload(name) {
            return load(name, true);
        }
        $pages.preload = preload;
        function fail(err, name, preload) {
            $alpbros.$ui.loader.hide();
            delete waiting[name];
            // redirect
            if (err && err.redirect)
                return $alpbros.$app.hashChange(err.redirect);
            if (!preload)
                $alpbros.$app.back();
            console.error("Could not load page " + name + "! " + err);
        }
        /** Gets or loads the specified page container from DOM or Server. */
        function getPageCnt(name) {
            var pageCnt = $("#" + name + ".page");
            if (pageCnt.length > 0)
                return $.Deferred().resolve(pageCnt).promise();
            return $.ajax({
                type: "GET",
                url: "pages/" + name + ".html"
            }).then(function (pageHtml) {
                // any page html?
                if (!pageHtml)
                    pageHtml = '<div id="' + name + '"></div>';
                // append page cnt
                pageCnt = $(pageHtml);
                $alpbros.$body.append(pageCnt);
                return pageCnt;
            });
        }
        /** Returns the constructor for the specified page. */
        function getCtor(name) {
            // remove - from name
            var parts = name.split("-");
            name = $q(parts).Select(function (p) { return p[0].toUpperCase() + p.substr(1); }).ToArray().join("");
            return $pages["Page" + name] || $pages.Page;
        }
        /** Gets the specified page container. */
        function get(name) {
            return pages[name];
        }
        $pages.get = get;
        /** Returns whether the specified page exists. */
        function exists(name) {
            return $alpbros.$cfg.pages[name] != null;
        }
        $pages.exists = exists;
    })($pages = $alpbros.$pages || ($alpbros.$pages = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdSignin = /** @class */ (function () {
            function CmdSignin() {
            }
            /** Executes the command. */
            CmdSignin.prototype.exec = function (args) {
                // get/check email and pwd
                var hash = args.hash, email = args.email, pwd = args.pwd;
                if (!hash && (!email || !pwd))
                    return $.Deferred().reject("Missing credentials!").promise();
                // get return url
                var returnUrl = args["return"] || "#/";
                // sign in
                $alpbros.$ui.loader.show(); // show loader
                return (hash ? $alpbros.$ctx.session.hashauth(hash) : $alpbros.$ctx.session.signin(email, pwd))
                    .always(function () { $alpbros.$ui.loader.hide(); }) // always hide loader
                    .done(function (session) {
                    // set document session classes
                    $alpbros.$app.setAuthenticated(true);
                    // goto return url
                    return $alpbros.$app.hashChange($alpbros.$util.ensureStartsWith(returnUrl, "#"));
                })
                    .fail(function (jqXHR, status, err) {
                    // log error
                    console.error(err);
                });
            };
            return CmdSignin;
        }());
        $cmd.CmdSignin = CmdSignin;
    })($cmd = $alpbros.$cmd || ($alpbros.$cmd = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdSignout = /** @class */ (function () {
            function CmdSignout() {
            }
            /** Executes the command. */
            CmdSignout.prototype.exec = function (args) {
                return $alpbros.$ctx.session.signout()
                    .always(function () { $alpbros.$app.back(); })
                    .done(function () {
                    // set app unauthenticated
                    $alpbros.$app.setAuthenticated(false);
                });
            };
            return CmdSignout;
        }());
        $cmd.CmdSignout = CmdSignout;
    })($cmd = $alpbros.$cmd || ($alpbros.$cmd = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    var $cmd;
    (function ($cmd) {
        /** Executes the specified command. */
        function exec(name, args) {
            var ctor = $cmd["Cmd" + name[0].toUpperCase() + name.substr(1)];
            if (!ctor)
                return $.Deferred().reject("Cmd " + name + " not found!").promise();
            return new ctor().exec(args || {});
        }
        $cmd.exec = exec;
        /** Executes the specified command. */
        function execUrl(url) {
            if (!url || url.page != "cmd" || !url.dest)
                return $.Deferred().reject("Invalid cmd url '" + (url ? url.hash : "") + "'").promise();
            return exec(url.dest, url.args);
        }
        $cmd.execUrl = execUrl;
        /** Specifies an executable command. */
        var Cmd = /** @class */ (function () {
            /** Initializes a new instance. */
            function Cmd() {
            }
            /** Executes the command. */
            Cmd.prototype.exec = function (args) {
                return $.Deferred().resolve().promise();
            };
            return Cmd;
        }());
        $cmd.Cmd = Cmd;
    })($cmd = $alpbros.$cmd || ($alpbros.$cmd = {}));
})($alpbros || ($alpbros = {}));
var $alpbros;
(function ($alpbros) {
    $alpbros.$window = $(window);
    $alpbros.$doc = $(document.documentElement);
    $alpbros.$body = $(document.body);
    $alpbros.$main = $("#main.page");
    /** Main application */
    var $app;
    (function ($app) {
        /** History length on app start. */
        var historyLength;
        /** En-/disables the hash change event. */
        var pauseHashChange = false;
        /** En-/disables the popstate event. */
        var pausePopState = false;
        /** True if the current hash change is a history pop/back. */
        var popstate = false;
        /** Initializes the app. */
        function init(cfg) {
            // get config and main elements
            $alpbros.$cfg.init(cfg);
            // disable automatic scrolling on history changes
            if (Modernizr.history) {
                history.scrollRestoration = "manual";
                historyLength = history.length;
            }
            // listen for hash change
            $alpbros.$window.on("hashchange", function () {
                if (!pauseHashChange)
                    hashChange();
            });
            // listen history pop/back
            if (Modernizr.history)
                $alpbros.$window.on("popstate", function () {
                    if (!pausePopState)
                        popstate = true;
                });
            // init session refresh
            var refreshTimeout;
            $alpbros.$doc.click(function () {
                if (refreshTimeout)
                    return;
                $alpbros.$ctx.session.refresh()
                    .done(function () { setAuthenticated(true); })
                    .fail(function () { setAuthenticated(false); });
                refreshTimeout = setTimeout(function () {
                    refreshTimeout = null;
                }, 15000); // wait at least 15sec
            });
            // init app data
            $alpbros.$data.init();
            // init session and preload main page to ensure it gets the current one on app start
            $alpbros.$ctx.session.refresh()
                .done(function () { setAuthenticated(true); })
                .fail(function () { setAuthenticated(false); })
                .always(function () {
                $alpbros.$pages.preload("main").done(function () {
                    // init hash / load start page
                    hashChange(undefined, undefined, "immediate")
                        .done(function () {
                        // preload configured pages
                        $q($alpbros.$cfg.pages).Where(function (p) { return p.Value.preload; }).ForEach(function (p) { return $alpbros.$pages.preload(p.Key); });
                    });
                });
            });
        }
        $app.init = init;
        function hashChange(hash, anchor, speed) {
            // disable hash change event
            pauseHashChange = true;
            if (!popstate)
                pausePopState = true;
            // get url
            $alpbros.$url = $alpbros.$util.parseUrl(hash || window.location.hash);
            // is command?
            if ($alpbros.$url.page == "cmd")
                return $alpbros.$cmd.execUrl($alpbros.$url)
                    .fail(function (err) {
                    console.error(err);
                    return $app.back();
                });
            // is page change?
            var isPageChange = $alpbros.$pages.current && $alpbros.$url.page != $alpbros.$pages.current.name;
            // set location hash
            if (hash && window.location.hash != hash) {
                if (isPageChange) {
                    $alpbros.$ui.$backBtn.attr("href", window.location.hash); // set back btn
                    window.location.hash = hash; // use location.hash to remember page change in history
                }
                if (Modernizr.history)
                    setHash(hash); // set history and hash without triggering hashchange event
            }
            if (isPageChange) {
                speed = "immediate"; // scroll immediate on page change
                document.title = getTitle($alpbros.$url); // change page title
                if (!popstate)
                    $alpbros.$pages.current.remOffset($alpbros.$window.scrollTop()); // remember scroll position on page change, but not on popstate
            }
            // check anchor and speed args
            var args = $alpbros.$url.args;
            if (args) {
                if (args.anchor)
                    anchor = args.anchor;
                if (args.speed)
                    speed = args.speed;
            }
            // smooth scroll
            return $alpbros.$ui.scrollTo($alpbros.$url, anchor, speed, popstate)
                .done(function () { pauseHashChange = pausePopState = popstate = false; }); // enable hash change event
        }
        $app.hashChange = hashChange;
        /** Gets the title for the specified url. */
        function getTitle(url) {
            var p = $alpbros.$res[url.page];
            var d = url.dest && p ? p[url.dest] : null;
            if (d && d.title)
                return d.title;
            else if (p && p.title)
                return p.title;
            return $alpbros.$res["main"].title;
        }
        /** Set's the hash without triggering hashchange event. Only cal if history api is supported! */
        function setHash(hash) {
            history.replaceState(hash, undefined, hash);
        }
        $app.setHash = setHash;
        /** Go home. */
        function home() {
            hashChange("#/");
        }
        $app.home = home;
        /** Go back. */
        function back(hash) {
            popstate = true; // next hashchange will run as popstate
            if (!hash)
                hash = $alpbros.$ui.$backBtn.attr("back") || $alpbros.$pages.current && $alpbros.$pages.current.defaultBack() || "#/";
            hashChange(hash);
        }
        $app.back = back;
        /** Sets the app authentication state. */
        function setAuthenticated(authenticated) {
            $alpbros.$doc.toggleClass("authenticated", authenticated).toggleClass("unauthenticated", !authenticated);
        }
        $app.setAuthenticated = setAuthenticated;
    })($app = $alpbros.$app || ($alpbros.$app = {}));
    // set skel breakpoints
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)',
        minxlarge: '(min-width: 1680px)',
        minlarge: '(min-width: 1280px)',
        minmedium: '(min-width: 980px)',
        minsmall: '(min-width: 736px)',
        minxsmall: '(min-width: 480px)',
        minxxsmall: '(min-width: 360px)'
    });
})($alpbros || ($alpbros = {}));
