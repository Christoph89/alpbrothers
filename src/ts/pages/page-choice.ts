/*! Alpbrothers - pages/page-choice.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Main page. */
  export class PageChoice extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // ready
      wait.resolve(this);
    }

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>, args?: any)
    {
      $(".inner", this.pageCnt).empty().append('<h2></h2><p></p><ul class="actions"></ul>');

      // set title and text
      if (!args) args=$url.args;
      $("h2", this.pageCnt).text(args.title);
      $("p", this.pageCnt).text(args.text);
      
      var actions=$(".actions", this.pageCnt).empty();
      for (var prop in args)
      {
        var text=prop;
        var url=args[prop];
        if (text[0]!="@")
        continue;
        text=text.substr(1);
        actions.append('<li><a href="'+url+'" class="button special">'+text+'</a></li>');
      }

      // init links
      $ui.link.init(this.pageCnt);

      // ready
      wait.resolve(this);
    }
  }
}