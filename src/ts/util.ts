/*! Alpbrothers - util.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros.$util
{
  /** Returns the formatted date string of the specified datetime. */
  export function formatDate(date: Date, format: string)
  {
    return moment(date).format(format);
  }

  /** Returns the formatted string for the specified from/to date. */
  export function formatFromTo(from: Date, to: Date, format: string, multiDayFormat?: string)
  {
    if (multiDayFormat &&  !dateEquals(from, to)) format=multiDayFormat; // mulitple days
    var parts=format.split("-");
    return moment(from).format(parts[0].trim())+" - "+moment(to).format(parts[1].trim());
  }

  /** Returns whether the date part of the specified datetimes is equal. */
  export function dateEquals(from: Date, to: Date)
  {
    return from.getFullYear()==to.getFullYear() && from.getMonth()==to.getMonth() && from.getDate()==to.getDate();
  }

  /** Ensures that the specified string starts with the prefix. */
  export function ensureStartsWith(str: string, prefix: string)
  {
    if (str==null) str="";
    if (str[0]==prefix) 
      return str;
    return prefix+str;
  }
 
  /** Gets the offset to the specified element.
   * anchor = top|middle
   */
  export function getOffset(element: JQuery|string, anchor: string="top"): number 
  {
    element=<JQuery>(typeof element=="string"?$(element):element);
    if (element.length==0)
      return null;
    var offset=element.offset().top;
    if (anchor=="middle")
      return offset - ($(window).height() - element.outerHeight()) / 2;
    return Math.max(offset, 0); 
  }

  /** Returns all recurrences of the specified event. */
  export function getRecurrences(event: MTBEvent): MTBEvent[]
  {
    var recurrences=[event];

    // get images
    var images: string[]=typeof event.img=="string"?[event.img]:event.img;
    event.img=images[0];

    // no recurrences
    if (!event.repeat)
      return recurrences;

    // get how to repeat
    var func: string;
    var interval: number;
    var times=parseInt(event.repeat);
    if (!isNaN(times))
      interval=7; // interval is weekly if not specified
    else
    {
      times=parseInt(event.repeat.substr(1));
      switch (event.repeat[0])
      {
        // monthly
        case "m": 
          func="Month";
          interval=1;
        // weekly
        case "w":
        default:
          func="Date";
          interval=7;
      }
    }


    // repeat
    for (var i=1; i<=(times-1); i++)
    {
      var rec: MTBEvent=$.extend({}, event); // copy event
      rec.repeat=null; // recurrence does not repeat again
      rec.img=images[i%images.length];

      // repeat
      var from=new Date(rec.from.getTime()), to=new Date(rec.to.getTime());
      if (from) 
      {
        rec.from=new Date(from["set"+func](from["get"+func]()+(interval*i))); // copy and set new from date
        rec.isofrom=moment(rec.from).format("YYYY-MM-DD");
      }
      if (to) rec.to=new Date(to["set"+func](to["get"+func]()+(interval*i))); // copy and set new to date

      // add reccurence
      recurrences.push(rec);
    }

    return recurrences;
  }

  /** Localizes the specified object propery (if possible). */
  export function localize(obj: any, property?: string)
  {
    if (!property) property="name";
    var val=obj[property+"_"+$cfg.lang];
    if (val===undefined)
      val=obj[property];
    return val;
  }

  /** Returns the page wrapper of the specified element. */
  export function getPage(el: JQuery): $pages.Page
  {
    // get parent wrapper
    var pw=el;
    while (pw && !pw.hasClass("page"))
      pw=pw.parent();
    return pw.hasClass("page")?pw.data("page"):null;
  }

  /** Returns specified hash url. */
  export function parseUrl(hash: string): HashUrl
  {
    hash=hash.replace("#/", "").replace("#", "");
    var url: HashUrl={ hash: "#/"+hash };
    var parts=hash.split("?");

    // set stack
    var loc=(parts[0]||"").split("/");
    url.page=loc[0];
    if ($cfg.pages.indexOf(url.page)<0)
    {
      url.dest=url.page;
      url.page="main";
    }
    else
      url.dest=loc[loc.length-1];
    
    // add args
    url.args=splitArgs(parts[1]);

    return url;
  }

  /** Parses the specified hash args. */
  export function splitArgs(argStr: string): any
  {
    if (!argStr)
      return null;
    var args={};
    $q(argStr.split("&")).ForEach(x => 
    {
      var parts=x.split("=");
      args[parts[0]]=parts[1];
    });
    return args;
  }
}