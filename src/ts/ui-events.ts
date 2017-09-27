/*! Alpbrothers - ui-events.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros.$ui.events
{
  /** Initializes the events table. */
  export function init()
  {
    // hide expired events
    var remaining=hideExpired();

    // show no-event info if there are no remaining events
    if (remaining==0)
      $("#events").addClass("no-events");
  }

  /** Hides all expired events and returns the nr of remaining events. */
  function hideExpired()
  {
    var now=new Date();
    var remaining=0;
    $("#events tr.event").each((idx, el) =>
    {
      var event=$(el);
      var expires=new Date(event.attr("date"));
      if (now>expires)
        event.remove(); // remove instead of hide, otherwise the first row is missing the top border
      else
        remaining++;
    });
    return remaining;
  }
}