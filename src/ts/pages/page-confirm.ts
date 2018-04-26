/*! Alpbrothers - pages/page-choice.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Main page. */
  export class PageConfirm extends Page
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
      // set title and text
      var args=$url.args;
      $("h2", this.pageCnt).text(args.title);
      $("p", this.pageCnt).text(args.text);
      if (args.ok) $(".button.ok", this.pageCnt).attr("href", args.ok);
      if (!args.cancel) args.cancel="#back";
      $(".button.cancel", this.pageCnt).attr("href", args.cancel);

      // ready
      wait.resolve(this);
    }
  }
}