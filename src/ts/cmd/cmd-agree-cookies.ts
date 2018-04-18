/*! Alpbrothers - cmd/cmd-test.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros.$cmd
{
  /** Sign out command. */
  export class CmdAgreeCookies
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      $ctx.session.agreeCookies();
      $app.setCookieAgreement(true);
      $app.back();
      return $.Deferred<any>().resolve().promise();
    }
  }
}