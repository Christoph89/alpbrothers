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
    $metaPromise.done(() => 
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
    tbl.prepend($q($meta.allEvents)
      .Take($cfg.shownEvents)
      .Select(ev => getEventRow(ev))
      .ToArray());
  }

  /** Returns an event row. */
  function getEventRow(event: MTBEvent): JQuery
  {
    return $("<tr>").addClass("event")
      .append($("<td>").text(moment(event.from).format($res.upcoming.dateFormat)))
      .append($("<td>")
        .append($("<a>")).attr("href", $cfg.root+event.url).attr("target", "_blank").text(event.name))
      .append($("<td>").text(event.price=="Erlebniscard"?$res.events.erlebniscardPrice:event.price));
  }
}