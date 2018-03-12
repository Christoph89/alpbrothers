/*! Alpbrothers - ui-items.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ui.ts" />
"use strict";

module $alpbros.$ui.items
{
  var delay: 50;

  /** Initializes all item lists. */
  export function init(context?: JQuery)
  {
    // display items on scroll
    $ui.scrollex.init($(".items", context), { delay: delay })
      .context.children()
      .wrapInner('<div class="inner"></div>');
  } 
}