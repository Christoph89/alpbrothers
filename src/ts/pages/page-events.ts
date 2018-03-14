/*! Alpbrothers - page-timeline.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Timeline page. */
  export class PageEvents extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // get timeline element
      this.timelineCnt=$("#event-timeline");

      // wait for meta/events
      $metaPromise.done(() => 
      {
        // append events
        this.appendEvents();

        // init ui, search form and timeline
        $ui.init(pageCnt);
        this.initForm();
        this.timeline=this.timelineCnt.timeline();
        this.filterTimeline();

        // ready
        wait.resolve(this);
      })
      .fail(() => { wait.reject(); });
    }

    private timelineCnt: JQuery;
    private timeline: $ui.Timeline;
    private timelineItems: { event: MTBEvent, item: JQuery }[];

    /** Loads the timeline page */
    public load(wait: JQueryDeferred<Page>)
    {
      // init blocks on first load
      if (!this.timeline.hasBlocks())
        this.timeline.initBlocks();

      // show/hide blocks
      this.timeline.refreshBlocks();

      // loaded
      wait.resolve(this);
    }

    /** Initializes the event search form. */
    private initForm()
    {
      // init from date
      $("input#event-from-date").val((new Date()).toISOString().substr(0, 10));

      // init tour select
      var typeSelect=$("select#event-type");
      $q(MTBEventTypes).ForEach(x => {
        var type=<MTBEventType>x.Value;
        typeSelect.append('<option value="'+type.id+'">'+type.name+'</option>');
      });

      // set change event
      $("input,select").change(() => this.filterTimeline());
    }

    /** Appends all events. */
    private appendEvents()
    {
      this.timelineItems=$q($meta.allEvents).Select(ev => <any>{
        event: ev,
        item: this.getTimelineItem(ev)
      }).ToArray();
      this.timelineCnt.append($q(this.timelineItems).Select((x, i) => x.item.toggleClass("even", i%2!=0)).ToArray());
    }

    /** Filters the events by the criteria specified in the search form. */
    private filterTimeline()
    {
      var v: string;
      var fromDate=(v=$("#event-from-date").val())?new Date(v):null;
      var toDate=(v=$("#event-to-date").val())?new Date(v):null;
      var type=$("#event-type").val();
      var level=MTBLevel.None 
        | ($("#event-level-beginner").is(":checked")?MTBLevel.Beginner:MTBLevel.None)
        | ($("#event-level-advanced").is(":checked")?MTBLevel.Advanced:MTBLevel.None);
        
      var visible=0;
      $q(this.timelineItems).ForEach(x =>
      {
        var ev=x.event;
        var hide=fromDate && ev.from<fromDate
          || toDate && ev.to>toDate
          || type && type!="all" && ev.type.id!=type
          || level<MTBLevel.All && ev.level!=MTBLevel.None && (ev.level&level)==0;
        x.item.toggleClass("hidden", hide);
        if (!hide) 
        {
          x.item.toggleClass("even", visible%2!=0).toggleClass("first-child", visible==0);
          visible++;
        }
      });

      // show/hide blocks
      this.timeline.refreshBlocks();
    }

    /** Returns a timeline item. */
    private getTimelineItem(event: MTBEvent): JQuery
    {
      var price=event.price=="Erlebniscard"?$res.events.erlebniscardPrice:event.price;
      var eventUrl="#/event?id="+event.id+"&date="+event.isofrom;
      return $('<div class="timeline-block" eventId="'+event.id+'">'+
        '<div class="timeline-img bg-color-'+this.getLevelColor(event)+'" title="'+event.type.name+'">'+
          '<span class="icon style2 major '+event.type.icon+'"></span>'+
        '</div>'+
        '<div class="timeline-content">'+
          '<h3>'+event.name+'<br /><code><span class="icon fa-money"></span> '+price+'</code></h3>'+
          '<p>'+
            '<img src="'+$cfg.root+$res.events.imgPath+event.img+'" />'+
            '<strong>'+
              $util.formatFromTo(event.from, event.to, $res.events.dateFormat, $res.events.multiDayFormat)+
              "<br />"+$res.events.level+": "+$res.level[MTBLevel[event.level]]+
            '</strong><br /><br />'+
            event.shortText+
          '</p><br style="clear: both;" />'+
          '<a href="'+eventUrl+'" class="button special icon fa-pencil">Details & Anmeldung</a>'+
          '<span class="date">'+$util.formatDate(event.from, $res.events.fromFormat)+'</span>'+
        '</div>'+
      '</div>').data("event", event);
    }

    /** Returns the color for the specified event's level. */
    private getLevelColor(event: MTBEvent)
    {
      switch (event.level)
      {
        case MTBLevel.Beginner: return "green";
        case MTBLevel.Advanced: return "orange";
        default: return  "blue";
      }
    }
  }
}