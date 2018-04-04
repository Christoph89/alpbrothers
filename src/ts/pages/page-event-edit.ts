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

      // init input fields
      var inputs=["type", "level", "name-de", "name-en", 
        "short-descr-de", "short-descr-en", "descr-de", "descr-en",
        "requirements-de", "requirements-en", "from", "to"];
      $q(inputs).ForEach(x => { this[x.replace(/-/g, "_")]=this.input(x); });

      // init images
      this.img=$(".event-img", pageCnt).click(function () 
      {
        $(".event-img.selected").removeClass("selected");
        $(this).addClass("selected");
      });

      // init dates table
      this.datesTbl=$("table.dates", pageCnt);
      $("a.add-date", this.datesTbl).click(() => this.addDate());

      // ready
      wait.resolve(this);
    }

    // input fields/controls
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

    private dates: EventDate[];

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      //set page mode
      this.pageCnt.attr("mode", $url.dest||"edit");

      // init dates
      this.dates=[];

      // ready
      if (wait) wait.resolve(this);
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
      if ($q(this.dates).Any(x => x.from.isSame(from) && x.to.isSame(to)))
        return  alert("Duplicate date");
      this.dates.push({
        from: from,
        to: to
      });
      this.refreshDatesTbl();
    }

    /** Refreshes the dates table. */
    private refreshDatesTbl()
    {
      var tbody=$("tbody", this.datesTbl).empty();
      $q(this.dates).OrderBy(dt => dt.from).ForEach(dt => {
        tbody.append(this.getDateRow(dt));
      });
    }

    private getDateRow(date: EventDate)
    {
      var row: JQuery;
      return (row=$("<tr>")).data("date", date).append(
        // from date
        $("<td>").text(date.from.format($res.event.edit.dateFormat)),
        // to date
        $("<td>").text(date.to.format($res.event.edit.dateFormat)),
        // buttons
        $("<td>").append(
          // repeat next week button
          $("<a>").addClass("icon style2 fa-repeat").attr("title", $res.event.edit.repeat).click(() =>
          {
            var repeated={
              from: date.from.clone().add(7, "days"),
              to: date.to.clone().add(7, "days")
            };
            this.dates.push(repeated);
            this.refreshDatesTbl();
          }),
          // remove button
          $("<a>").addClass("icon style2 fa-minus").click(() =>
          {
            // remove date
            this.dates=$q(this.dates).Where(x => x!==date).ToArray();
            // refresh dates table
            this.refreshDatesTbl();
          })
        )
      );
    }

    /** Gets the specified input element by name. */
    private input(name: string)
    {
      return $("input[name='event-"+name+"']", this.pageCnt);
    }
  }
}