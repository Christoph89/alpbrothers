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

        // wait for map ready
        (<JQueryPromise<any>>$(".map", this.pageCnt).data("gmap_promise")).done(() => 
        {
          // get map marker
          this.mapMarker=$(".map", this.pageCnt).data("gmap_markers")[0];

          // ready
          wait.resolve(this);
        });
      });
    }

    /** Google maps marker */
    private mapMarker: any;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      // get url args
      var eventId=parseInt($url.args.id);

      // check if eventId and date is set
      if (!eventId)  
      {
        if (wait) wait.reject("Missing eventId and/or date!");
        return;
      }

      // // get event
      var event: MTBEvent=$data.eventMap.Get(eventId);
      if (!event)
      {
        if (wait) wait.reject("Event not found for '"+$url.hash+"'!");
        return;
      }

      // set event data
      var res=$res.event.details;
      var get=(n) => $(".event-"+n, this.pageCnt);
      get("name").text(event.name());
      get("description").text(event.description());
      get("img").attr("src", event.img());
      var dateStr=$util.formatFromTo(event.from(), event.to(), $res.event.details.dateFormat);
      get("date").html(res.date.format(dateStr));
      get("level").html(res.level.format(event.levelDescription()))
      var startTime=event.from().format(res.meetingTimeFormat);
      get("meeting").html(res.meeting.format(startTime, event.meetingPointDescription()));
      get("participants").html(res.participants.format(event.maxParticipants()))
      var price=event.isErlebniscard()?res.erlebniscardPrice:res.price.format(event.priceAsNr());
      get("price").html(price);
      this.mapMarker.setPosition(new google.maps.LatLng(event.lat(), event.lng()));
      this.pageCnt.toggleClass("erlebniscard", event.isErlebniscard());
      this.pageCnt.toggleClass("allow-reg", event.isRegAllowed());
      this.setRequirements(event);

      // ready
      if (wait) wait.resolve(this);
    }

    private setRequirements(event: MTBEvent)
    {
      var requirements: string[]=[];
      var lines=$q((event.requirements()||"").split("\n")).Select(x => x.trim()).ToArray();
      var addDefault=lines[0]!="!";
      var text=$q(lines).FirstOrDefault(null, x => x[0]!="*") || $res.requirements[event.type().name].text;
      var customReq=$q(lines).Where(x => x[0]=="*").ToArray();
      
      // add default requirements
      if (addDefault)
      {
        var i=0;
        while (true)
        {
          var dreq=$res.requirements[event.type().name][i.toString()];
          if (!dreq)
            break;
          requirements.push(dreq);
          i++;
        }
      }
      else if (customReq[0]=="!")
        customReq=$q(customReq).Skip(1).ToArray();

      // add custom requirements
      requirements=requirements.concat(customReq);

      // set text
      $(".event-requirements-text", this.pageCnt).html($util.formatMd(text));

      // set requirements
      $(".event-requirements", this.pageCnt).empty().append($q(requirements).Select(r => $("<li>"+$util.formatMd($util.trimStart(r, "*").trim())+"</li>")).ToArray());
    }
  }
}