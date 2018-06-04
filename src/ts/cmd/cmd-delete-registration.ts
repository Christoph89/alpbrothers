/*! Alpbrothers - cmd/cmd-delete-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros.$cmd
{
  /** Sign out command. */
  export class CmdDeleteRegistration
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      // get event id
      var reg: IMTBEventRegistration=args;
      if (!reg || !reg.regId)
        return $.Deferred<any>().reject("Missing reg!").promise();

      return $app.confirm("Delete Reg?", "Do you really want to delete the reg?", args.ok, args.cancel).done(res =>
      {
        $ui.loader.show(); // show loader
        return $ctx.deleteRegistration(reg, args.force, args.status)
          .always(() => { $ui.loader.hide(); }) // hide loader
          .done(deleted =>
          {
            // go back
            return $app.hashChange(args.goto);
          });
      });
    }
  }
}