/*! Alpbrothers - cmd/cmd-delete-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros.$cmd
{
  /** Sign out command. */
  export class CmdDeleteEvent
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      // get event id
      var eventId=parseInt(args.id);
      if (eventId==null || isNaN(eventId))
        return $.Deferred<any>().reject("Missing id!").promise();
      
      // get event
      var event: MTBEvent=$data.eventMap.Get(eventId);
      if (!event)
        return $.Deferred<any>().reject("Missing event with id "+eventId+"!").promise();

      // is series?
      var events=[event];
      if (event.isSeries())
        events=event.occurrences().concat(event);

      $ui.loader.show(); // show loader
      return $ctx.db.event.delete($q(events).Select(x => x.state).ToArray())
        .always(() => { $ui.loader.hide(); }) // hide loader
        .done(deleted =>
        {
          // delete from data
          $data.deleteEvent(deleted);

          // go to events page
          return $app.hashChange(args.goto);
        });
    }
  }
}