/*! Alpbrothers - app.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros
{
  export var $wrapper: JQuery;

  export module $app
  {
    export function init()
    {
      // get main elements
      $wrapper=$("#wrapper");

      // init ui
      $menu.init(); // menu
      $maps.init(); // google maps
      $util.checkSvgCompatibility(); // use png if svg is not supported
    }
  }

  // init app on document ready
  $(document).ready(() =>
  {
    $app.init();
  });
}