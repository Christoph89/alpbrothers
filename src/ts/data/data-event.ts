/*! Alpbrothers - data/data-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros
{
  /** Defines a mtb event. */
  export interface IMTBEvent
  {
    /** The event id. */
    eventId: number;
    /** The parent event id. */
    parentId: number;
    /** The from date/time. */
    from: string;
    /** The to date/time. */
    to: string;
    /** The event type. */
    type: number;
    /** The german event name. */
    name: string;
    /** The english event name. */
    name_en: string;
    /** The german event description. */
    description: string;
    /** The english event description. */
    description_en: string;
    /** The event price. */
    price: string;
    /** The event level. */
    level: MTBLevel;
    /** The event image. */
    img: string;
    /** The event template. */
    tpl: string;
  }

  /** Defines a mtb event. */
  export class MTBEvent
  {
    /** Initializes a new instance. */
    constructor(state?: IMTBEvent)
    {
      this.state=state;
    }

    public static ErlebniscardPrice="Erlebniscard";

    /** The state of the event. */
    public state: IMTBEvent;

    /** Gets the value for the specified property. */
    private get(prop: string, type?: string)
    {
      switch (type)
      {
        case "date":
          return $util.mergeDatesStr(this.state[prop], this.p(prop));

        case "localize":
          return $util.localize(this.state, prop) || $util.localize(this.p(), prop);

        default:
          return this.state[prop] || this.p(prop);
      }
    }

    /** Returns the specified property from the parent state or null if the event has no parent. */
    private p(prop?: string) : any 
    {  
      var parent=this.parent();
      if (parent && parent.state)
        return prop?parent.state[prop]:parent.state;
      return null;
    }

    /** Returns the event id. */
    public eventId() { return this.state.eventId; }

    /** Returns the parent event id. */
    public parentId() { return this.state.parentId; }

    /** Returns the parent event. */
    public parent() { return $data.eventMap.Get(this.state.parentId); }

    /** Returns the event from date/time. */
    public from() { return this.get("from", "date"); }

    /** Returns the event to date/time. */
    public to() { return this.get("to", "date"); }

    /** Returns the event type id */
    public typeId() { return this.get("type"); }

    /** Returns the event type. */
    public type() { return MTBEventTypes[this.typeId()]; }

    /** Returns the localized event name. */
    public name(): string { return this.get("name", "localize"); }
    
    /** Returns the german event name. */
    public name_de(): string { return this.get("name"); }
    
    /** Returns the english event name. */
    public name_en(): string { return this.get("name_en"); }

    /** Returns the localized event description. */
    public description(): string { return this.get("description", "localize"); }
    
    /** Returns the german event description. */
    public description_de(): string { return this.get("description"); }
    
    /** Returns the english event description. */
    public description_en(): string { return this.get("description_en"); }

    /** Returns the event price */
    public price() { return this.get("price"); }

    /** Returns whether the event is an Erlebniscard event. */
    public isErlebniscard() { return this.price()===MTBEvent.ErlebniscardPrice; }

    /** Returns the event level */
    public level() { return this.get("level"); }

    /** Returns the event image */
    public img() 
    { 
      var img: string=this.get("img");
      if (!img)
        img=this.type().name+".jpg";
      if (img.substr(0, 5)=="data:")
        return img;
      return $cfg.root+$res.events.imgPath+img;
    }

    /** Returns the event template */
    public tpl() { return this.get("tpl"); }
  }
}