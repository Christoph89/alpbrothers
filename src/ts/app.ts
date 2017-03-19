/*! Alpbrothers - app.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros
{
  export var $window: JQuery;
  export var $body: JQuery;
  export var $wrapper: JQuery;

  export module $app
  {
    export function init()
    {
      // get main elements
      $window=$(window);
      $body=$(document.body);
      $wrapper=$("#wrapper");

      // initialize ui
      $ui.init();
    }
  }

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
  $(document).ready(() =>
  {
    $app.init();
  });
}