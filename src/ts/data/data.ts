/*! Alpbrothers - data/data.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
/// <reference path="data-eventtype.ts" />
/// <reference path="data-event.ts" />
"use strict";

module $alpbros.$data
{
  export var waitEvents: JQueryPromise<MTBEvent[]>;
  export var events: MTBEvent[];
  export var eventMap: linq.Dictionary<MTBEvent>;

  /** Initializes all app data. */
  export function init(): JQueryPromise<any>
  {
    return $.when(
      // load events
      (waitEvents=$ctx.db.event.q().orderBy("from asc").find())
        .then((res => 
        {
          events=res;
          eventMap=$q(res).ToDictionary(x => x.state.eventId, x => x);
        }))
    )
  }
}