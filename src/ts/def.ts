/*! Alpbrothers - def.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros
{
  export interface Localized
  {
    localize?: (property?: string)=> string;
  }

  export interface Meta
  {
    events: MTBEvent[];
    allEvents: MTBEvent[];
  }

  export interface AppCfg
  {
    root: string;
    lang: string;
    shownEvents: number;
    pages: string[];
    preloadPages: string[];
    res: any;
    meta: Meta;
    ctx:
    {
      apikey: string;
      baseurl: string;
      db: string;
    }
  }

  /** Specifies all roles. */
  export enum Roles
  {
    /** Partner role. */
    Partner=2,
    /** WWW role. */
    WWW=3,
    /** Admin role. */
    Admin=4
  }

  export interface HashUrl
  {
    hash: string;
    page?: string;
    dest?: string;
    args?: any;
  }

  export enum MTBLevel
  {
    None=0,
    Beginner=1<<0,
    Advanced=1<<1,
    All=1<<0 | 1<<1,
  }

  /** Specifies all event types. (Extended by resource!) */
  export var MTBEventTypes:{ [type: string]: MTBEventType }=
  {
    None:               { id: 0, name: "none", icon: "", offer: false },
    TechniqueTraining:  { id: 1, name: "", icon: "fa-cogs",    offer: true },
    GuidedTour:         { id: 2, name: "", icon: "fa-bicycle", offer: true },
    Camp:               { id: 3, name: "", icon: "fa-home",    offer: true },
    MechanicalTraining: { id: 4, name: "", icon: "fa-wrench",  offer: true },
  };

  export interface MTBEventType extends Localized
  {
    id: number;
    name: string;
    icon: string;
    offer: boolean;
  }

  export interface MTBEvent
  {
    id: number;
    type: MTBEventType;
    name: string;
    from: Date;
    to: Date;
    isofrom: string;
    price: string;
    level: MTBLevel;
    url: string;
    img: string;
    repeat?: string;
    shortText?: string;
    tpl?: string;
    recurrences: MTBEvent[];
  }

  export module $parse
  {
    function localize(json: any)
    {
      json.localize=function (prop) { return $util.localize(this, prop); };
    }

    export function meta(json: any): Meta
    {
      if (!json) return null;
      if (json.events) json.events=$q(json.events).Select(x => event(x, json)).ToArray();
      json.allEvents=$q(json.events).SelectMany(x => x.recurrences).OrderBy(x => x.from).ToArray();
      return json;
    }

    export function event(json: any, meta?: Meta): MTBEvent
    {
      if (!json) return null;
      if (!meta) meta=$meta;
      if (json.type) json.type=$q(MTBEventTypes).FirstOrDefault({ Key: "None", Value: MTBEventTypes.None }, x => x.Value.id==json.type).Value;
      if (json.from) 
      { 
        json.from=new Date(json.from);
        json.isofrom=moment(json.from).format("YYYY-MM-DD");
      }
      if (json.to) json.to=new Date(json.to);
      //json.level=MTBLevel[json.level];
      json.recurrences=$util.getRecurrences(json);
      //if (json.img) json.img=$q((<string>json.img).split(",")).Select(x => "img/events/"+x.trim()).ToArray();
      return json;
    }
  }
}