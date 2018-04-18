/*! Alpbrothers - pages/page-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="pages.ts" />
"use strict";

module $alpbros.$pages
{
  /** Specifies an event date. */
  interface EventDate
  { 
    /** The from date. */
    from: moment.Moment;
    /** The to date. */ 
    to: moment.Moment; 
  }

  /** Event page. */
  export class PageEventEdit extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);
      var that=this;

      // init input fields
      var inputs=["type", "level", "name-de", "name-en", 
        "short-descr-de", "short-descr-en", "descr-de", "descr-en",
        "requirements-de", "requirements-en", "from", "to"];
      $q(inputs).ForEach(x => { this[x.replace(/-/g, "_")]=this.input(x); });

      // init images
      this.img=$(".event-img", pageCnt).click(function () 
      {
        $(".event-img.selected", pageCnt).removeClass("selected");
        $(this).addClass("selected");
      });

      // init dates table
      this.input("from").change(function() { that.copyFromDate($(this)); });
      this.datesTbl=$("table.dates", pageCnt);
      $("a.add-date", this.datesTbl).click(() => this.addDate());

      // init save button
      $("a.button.save", this.pageCnt).click(() => { this.save(); });

      // ready
      wait.resolve(this);
    }

    // input fields/controls
    private mode: "add"|"edit";
    private type: JQuery;
    private level: JQuery;
    private name_de: JQuery;
    private name_en: JQuery;
    private priceType: JQuery;
    private price: JQuery;
    private short_descr_de: JQuery;
    private short_descr_en: JQuery;
    private descr_de: JQuery;
    private descr_en: JQuery;
    private requirements_de: JQuery;
    private requirements_en: JQuery;
    private img: JQuery;
    private datesTbl: JQuery;
    private from: JQuery;
    private to: JQuery;

    private occurrences: MTBEvent[];
    private editEvent: MTBEvent;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      //get/set page mode
      this.pageCnt.attr("mode", this.mode=<any>$url.dest||"edit");

      // get edit event
      if (this.mode=="edit")
      {
        var eventId=parseInt($url.args.id);
        if (eventId==null || isNaN(eventId))
          return wait.reject("Missing event id!");
        this.editEvent=$data.eventMap.Get(eventId);
        if (!this.editEvent)
          return wait.reject("Missing event "+eventId);
        this.initInputFields(this.editEvent);
      }
      else
        this.initInputFields(new MTBEvent(<any>{}));

      // ready
      if (wait) wait.resolve(this);
    }

    private initInputFields(event: MTBEvent)
    {
      this.input("name-de").val(event.name_de());
      this.input("name-en").val(event.name_en());
      var type=event.type() || MTBEventTypes.TechniqueTraining;
      this.input("type").val(type.name);
      var status=event.status() || MTBEventStatus.TakesPlace;
      this.input("status").val(MTBEventStatus[status]);
      var level=event.level();
      this.input("level", "[value="+MTBLevel[level]+"]").click();
      this.input("price-type", "[value="+(event.isErlebniscard()?"erlebniscard":"price")+"]").click();
      if (!event.isErlebniscard()) this.input("price").val(parseInt(event.price()));
      this.input("short-descr-de").val(event.shortDescription_de());
      this.input("short-descr-en").val(event.shortDescription_en());
      this.input("descr-de").val(event.description_de());
      this.input("descr-en").val(event.description_en());
      var img=event.img(false);
      $(".event-img"+(img?"[value='"+img+"']":".first"), this.pageCnt).click();
      this.occurrences=event.occurrences();
      this.refreshDatesTbl();
    }

    /** Adds the date from the event date row. */
    private addDate()
    {
      var from=moment(this.from.val());
      var to=moment(this.to.val());
      if (!from.isValid())
        return alert("Invalid from date!");
      if (!to.isValid())
        return alert("Invalid to date!");
      if ($q(this.occurrences).Any(x => x.from().isSame(from) && x.to().isSame(to)))
        return  alert("Duplicate date");
      this.occurrences.push(new MTBEvent({
        from: from.toISOString(),
        to: to.toISOString()
      }));
      this.refreshDatesTbl();
    }

    /** Refreshes the dates table. */
    private refreshDatesTbl()
    {
      // dates should occur only once
      this.occurrences=$q(this.occurrences).Distinct(x => x.from().toISOString()+"-"+x.to().toISOString()).ToArray();

      var tbody=$("tbody", this.datesTbl).empty();
      $q(this.occurrences).OrderBy(x => x.from()).ForEach(x => {
        tbody.append(this.getDateRow(x));
      });
    }

    private getDateRow(occurrence: MTBEvent)
    {
      var row: JQuery;
      var that=this;
      return (row=$("<tr>")).data("event", occurrence).append(
        // from date
        $("<td>").addClass("event-from").text(occurrence.from().format($res.event.edit.dateFormat)).change(function () { that.copyFromDate($(this)); }),
        // to date
        $("<td>").addClass("event-to").text(occurrence.to().format($res.event.edit.dateFormat)),
        // buttons
        $("<td>").append(
          // repeat next week button
          $("<a>").addClass("icon style2 fa-repeat").attr("title", $res.event.edit.repeat).click(() =>
          {
            this.occurrences.push(new MTBEvent({
              from: occurrence.from().clone().add(7, "days").toISOString(),
              to: occurrence.to().clone().add(7, "days").toISOString()
            }));
            this.refreshDatesTbl();
          }),
          // edit button
          $("<a>").addClass("icon style2 fa-pencil mode-edit").click(() =>
          {
            // @@ todo edit
          }),
          // remove button
          $("<a>").addClass("icon style2 fa-minus").click(() =>
          {
            // remove date
            this.occurrences=$q(this.occurrences).Where(x => x!==occurrence).ToArray();
            // refresh dates table
            this.refreshDatesTbl();
          })
        )
      );
    }

    /** Copies the from-date to the to-date input field. */
    private copyFromDate(from: JQuery)
    {
      var val=from.val();
      if (!val)
        return;
      var type=MTBEventTypes[<any>this.input("type").val()];
      from.parent().next().find("input[name=event-to]").val(moment(val).add(type.duration, "hours").format("YYYY-MM-DDTHH:mm"));
    }

    /** Gets the specified input element by name. */
    private input(name: string, state?: string)
    {
      return $("[name=event-"+name+"]"+(state||""), this.pageCnt);
    }

    /** Returns the event object from the input. */
    private getMainEvent(): IMTBEvent
    {
      if (this.occurrences.length==0)
        return null;
      var event: IMTBEvent=
      {
        eventId: 0,
        parentId: null,
        from: null,
        to: null,
        type: MTBEventTypes[<any>this.input("type").val()].id,
        status: MTBEventStatus[<string>this.input("status").val()],
        name: <string>this.input("name-de").val(),
        name_en: <string>this.input("name-en").val(),
        shortDescription: <string>this.input("short-descr-de").val(),
        shortDescription_en: <string>this.input("short-descr-en").val(),
        description: <string>this.input("descr-de").val(),
        description_en: <string>this.input("descr-en").val(),
        price: this.getPrice(),
        level: MTBLevel[<string>this.input("level", ":checked").val()],
        img: $(".event-img.selected", this.pageCnt).attr("value")
      };
      return event;
    }

    /** Returns all event occurences. */
    private getOccurrences(mainEvent: MTBEvent): IMTBEvent[]
    {
      return $q(this.occurrences).Select(x => 
      {
        x.state.parentId=mainEvent.eventId();
        return x.state;
      }).ToArray();
    }

    /** Gets the price. */
    private getPrice(): string
    {
      var type=this.input("price-type", ":checked").val();
      if (type=="erlebniscard")
        return MTBEvent.ErlebniscardPrice;
      return <string>this.input("price").val();
    }

    /** Saves (inserts or updates) the event. */
    private save(): void
    {
      // check if date has been added
      if (this.occurrences.length==0 && this.input("from").val() && this.input("to").val())
        $("a.add-date", this.pageCnt).click();

      var mainEvent=this.getMainEvent();
      
      // show loader
      $ui.loader.show(); 

      // insert or udpate
      if (this.mode=="add")
      {
        // insert main event
        $ctx.db.event.insert(mainEvent).done(event => 
        {
          // insert other occurences
          var occurences=this.getOccurrences(event);
          $ctx.db.event.insert(occurences).done(events => 
          {
            // add events to data
            $data.addEvent([event].concat(events));

            // go to edit page
            $app.hashChange("#/event/edit?id="+event.eventId());
          });
        })
        .always(() => { $ui.loader.hide(); }); // hide loader
      }
      else
      {
        // @@todo update
      }
    }
  }
}