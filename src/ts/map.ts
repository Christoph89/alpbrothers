/*! Alpbrothers - maps.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

declare var google: any;

interface MapPosition
{
  lat?: number;
  lng?: number;
}

interface MapMarker
{
  position?: MapPosition;
  title?: string;
}

interface Map
{
  element: JQuery;
  start?: MapPosition;
  zoom?: number;
  marker?: MapMarker[];
}

module $alpbros.$maps
{
  var apikey="AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
  var currentIdx=0;
  var maps: Map[]=[];

  export function init()
  {
    $(".map").q().ForEach(x => maps.push(createMap(x)));
  }

  function createMap(cnt: JQuery): Map
  {
    var map: Map={ element: cnt };
    var lat=parseFloat(cnt.attr("lat"));
    var lng=parseFloat(cnt.attr("lng"));
    var zoom=parseFloat(cnt.attr("zoom"));
    if (lat&&lng) map.start={ lat: lat, lng: lng };
    if (zoom) map.zoom=zoom;

    // read markers
    map.marker=$q($(".marker", cnt)).Select(x => 
    {
      var marker: MapMarker={
        position: 
        {
          lat: parseFloat(x.attr("lat")),
          lng: parseFloat(x.attr("lng"))
        },
        title: x.text()
      };
      return marker;
    }).ToArray();

    window["initMap"+currentIdx]=function () { initMap(map); };
    cnt.after('<script async defer src="https://maps.googleapis.com/maps/api/js?key='+apikey+'&callback=initMap'+currentIdx+'"></script>');
    currentIdx++;

    return map;
  }

  function initMap(map: Map)
  {
    // initialize the map and set the start location
    var gmap=new google.maps.Map(map.element[0], 
    {
      center: map.start?{ lat: map.start.lat, lng: map.start.lng }:null,
      zoom: map.zoom,
      styles: mapStyle
    });

    // add some markers
    var markers=$q(map.marker).ForEach(m => 
    {
      var marker=new google.maps.Marker({
        position: new google.maps.LatLng(m.position.lat, m.position.lng),
        title: m.title});
      marker.setMap(gmap);
    });

    // prevent mouse event capturing
    var innerMap: JQuery;
    map.element.mouseenter(() => 
    { 
      if (!innerMap)
      {
        innerMap=map.element.children().first();
        innerMap.mouseleave(() => { innerMap.addClass("no-pointer-events"); });
      }
      innerMap.addClass("no-pointer-events"); 
    });
    map.element.click(() => { innerMap.removeClass("no-pointer-events"); });
  }
}