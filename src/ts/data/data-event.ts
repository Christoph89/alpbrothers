/*! Alpbrothers - data/data-event.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros
{
  /** Defines the status of mtb events. */
  export enum MTBEventStatus
  {
    /** The event will take place. */
    TakesPlace=0,
    /** The event is in progress. */
    InProgress=1,
    /** The event is canceled and will not take place. */
    Canceled=3,
    /** The event has been deleted. */
    Deleted=3
  }

  /** Defines a mtb event. */
  export interface IMTBEvent
  {
    /** The event id. */
    eventId?: number;
    /** The parent event id. */
    parentId?: number;
    /** The from date/time. */
    from?: string;
    /** The to date/time. */
    to?: string;
    /** The event type. */
    type?: number;
    /** The event status. */
    status?: MTBEventStatus;
    /** The german event name. */
    name?: string;
    /** The english event name. */
    name_en?: string;
    /** The german short event description. */
    shortDescription?: string;
    /** The english short event description. */
    shortDescription_en?: string;
    /** The german event description. */
    description?: string;
    /** The english event description. */
    description_en?: string;
    /** The event price. */
    price?: string;
    /** The event level. */
    level?: MTBLevel;
    /** The event image. */
    img?: string;
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
          var dt=$util.mergeDatesStr(this.state[prop], this.p(prop));
          if (!dt.isValid()) dt=null;
          return dt;

        case "localize":
          return $util.localize(this.state, prop) || $util.localize(this.p(), prop);

        default:
          return this.state[prop]!=null ? this.state[prop] : this.p(prop);
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
    public eventId(): number { return this.state.eventId; }

    /** Returns the parent event id. */
    public parentId(): number { return this.state.parentId; }

    /** Returns the parent event. */
    public parent(): MTBEvent { return $data.eventMap.Get(this.state.parentId); }

    /** Returns the parent id or if not specified the own one. */
    public seriesId(): number { return this.parentId() || this.eventId();  }

    /** Returns the parent event or if not specified the current one. */
    public series(): MTBEvent { return $data.eventMap.Get(this.seriesId()); }

    /** Returns the event from date/time. */
    public from(): moment.Moment { return this.get("from", "date"); }

    /** Returns the event to date/time. */
    public to(): moment.Moment { return this.get("to", "date"); }

    /** Returns the event type id */
    public typeId(): number { return this.get("type"); }

    /** Returns the event type. */
    public type(): MTBEventType { return MTBEventTypes[this.typeId()]; }

    /** Returns the event status. */
    public status(): MTBEventStatus { return this.get("status"); }

    /** Returns the localized event name. */
    public name(): string { return this.get("name", "localize"); }
    
    /** Returns the german event name. */
    public name_de(): string { return this.get("name"); }
    
    /** Returns the english event name. */
    public name_en(): string { return this.get("name_en"); }

    /** Returns the localized event description. */
    public shortDescription(): string { return this.get("shortDescription", "localize"); }
    
    /** Returns the german event description. */
    public shortDescription_de(): string { return this.get("shortDescription"); }
    
    /** Returns the english event description. */
    public shortDescription_en(): string { return this.get("shortDescription_en"); }

    /** Returns the localized event description. */
    public description(): string { return this.get("description", "localize"); }
    
    /** Returns the german event description. */
    public description_de(): string { return this.get("description"); }
    
    /** Returns the english event description. */
    public description_en(): string { return this.get("description_en"); }

    /** Returns the event price */
    public price(): string { return this.get("price"); }

    /** Returns whether the event is an Erlebniscard event. */
    public isErlebniscard(): boolean { return this.price()===MTBEvent.ErlebniscardPrice; }

    /** Returns the event level */
    public level(): MTBLevel { return this.get("level"); }

    /** Returns the event image */
    public img(addPath: boolean=true): string
    { 
      var img: string=this.get("img");
      if (!img)
        return null;
      if (img.substr(0, 5)=="data:")
        return img;
      if (addPath)
        return $cfg.root+$res.events.imgPath+img;
      return img;
    }

    /** Returns all occurrences of the series. */
    public occurrences(): MTBEvent[]
    {
      var seriesId=this.seriesId();
      return $q($data.events).Where(x => x.seriesId()==seriesId && x.isOccurrence()).ToArray();
    }

    /** Returns whether the current event is an occurence (has parent). */
    public isOccurrence(): boolean
    {
      return this.from()!=null && this.to()!=null;
    }
  }
}