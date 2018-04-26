/*! Alpbrothers - ui-events.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ui.ts" />
"use strict";

module $alpbros.$ui.events
{
  /** Initializes the events table. */
  export function init(context?: JQuery)
  {
    // wait for meta
    $data.waitEvents.done(() => 
    {
      // init all event-tables after meta has been loaded
      $(".event-table table", context).each((i, el) =>
      {
        appendEvents($(el));
      });
    });
  }

  /** Appends all events. */
  function appendEvents(tbl: JQuery)
  {
    $("tr.dummy", tbl).remove();
    tbl.prepend($q($data.events)
      .Where(ev => ev.isOccurrence())
      .Take($cfg.shownEvents)
      .Select(ev => getEventRow(ev))
      .ToArray());
  }

  /** Returns an event row. */
  function getEventRow(event: MTBEvent): JQuery
  {
    var eventUrl=(<string>$res.events.eventUrl).format(event.eventId());
    return $("<tr>").addClass("event")
      .append($("<td>").text(event.from().format($res.upcoming.dateFormat)))
      .append($("<td>")
        .append($("<a>").attr("href", eventUrl).attr("target", "_blank").text(event.name())))
      .append($("<td>").text(event.priceText()));
  }
}