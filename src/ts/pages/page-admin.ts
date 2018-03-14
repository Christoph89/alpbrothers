/*! Alpbrothers - page-signin.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Main page. */
  export class PageAdmin extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init ui
      $ui.init(pageCnt);

      // ready
      wait.resolve(this);
    }

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      // check if user logged in and admin
      var session=$ctx.session.current;
      if (!session || session.role_id!=Roles.Admin)
      {
        // redirect to signin
        $app.hashChange("#/signin?return=/admin");
        wait.resolve(this);
        return;
      }

      // ready
      wait.resolve(this);
    }
  }
}