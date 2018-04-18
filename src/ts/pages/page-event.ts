/*! Alpbrothers - pages/page-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Event page. */
  export class PageEvent extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // wait for meta/events
      $data.waitEvents.done(() => 
      {
        // init ui
        $ui.init(pageCnt);

        // ready
        wait.resolve(this);
      });
    }

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      // get url args
      var eventId=$url.args.id;

      // check if eventId and date is set
      if (!eventId)  
      {
        if (wait) wait.reject("Missing eventId and/or date!");
        return;
      }

      // // get event
      // var event=$q($data.events).FirstOrDefault(null, x => x.eventId()==eventId);
      // if (!event)
      // {
      //   if (wait) wait.reject("Event not found for '"+$url.hash+"'!");
      //   return;
      // }

      // // show command and tpl, hide other sections
      // var tplName=$url.args.tpl||event.tpl()||"default";
      // var tpl=$(">section.common, >section."+tplName, this.pageCnt).removeClass("hidden");
      // $(">section:not(.common, ."+tplName+")", this.pageCnt).addClass("hidden");

      // // toggle erlebniscard fields
      // this.pageCnt.toggleClass("erlebniscard", event.price()=="Erlebniscard");

      // // set event name, price
      // $(".event-name", tpl).text(event.name());
      // $(".event-price-text", tpl).text(event.price());
      // $(".event-info", tpl).html(
      //   $util.formatFromTo(event.from(), event.to(), $res.events.dateFormat, $res.events.multiDayFormat)+
      //   "<br />"+$res.events.level+": "+$res.level[MTBLevel[event.level()]]);
      // $(".event-text", tpl).html(event.description());

      // ready
      if (wait) wait.resolve(this);
    }
  }
}