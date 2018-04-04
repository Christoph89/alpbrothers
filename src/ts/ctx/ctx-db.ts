/*! Alpbrothers - ctx/ctx-db.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ctx.ts" />
"use strict";

module $alpbros.$ctx.db
{
  /** Specifies a database table. */
  export class DBTable<T>
  {
    public name: string;
    public parse: (obj: any) => T;

    /** Initializes a new instance of DBTable. */
    public constructor(name: string, parse?: (obj: any) => T)
    {
      this.name=name;
      this.parse=parse;
    }

    /** Starts a new query. */
    public q(): DBQuery<T>
    { 
      return new DBQuery<T>(this);
    }
  }

  /** Specifies a database call. */
  export class DBQuery<T>
  {
    private _table: DBTable<T>;
    private _url: string;
    private _select: string;
    private _where: string;
    private _orderBy: string;
    private _groupBy: string;
    private _limit: number;
    private _offset: number;
    private _related: string;

    /** Initializes a new instance of DBCall. */
    public constructor(table: DBTable<T>)
    {
      this._table=table;
      this._url="/"+$cfg.ctx.db+"/_table/"+table.name;
    }

    /** Selects the specified fields. */
    public select(fields: string): DBQuery<T>
    {
      this._select=fields;
      return this;
    }

    /** Specifies a filter. */
    public where(filter: string): DBQuery<T>
    {
      this._where=filter;
      return this;
    }

    /** Specifies a relation. */
    public related(fields: string): DBQuery<T>
    {
      this._related=fields;
      return this;
    }

    /** Specifies to order the result by the given fields. */
    public orderBy(fields: string): DBQuery<T>
    {
      this._orderBy=fields;
      return this;
    }

    /** Specifies to group the result by the fiven fields. */
    public groupBy(fields: string): DBQuery<T>
    {
      this._groupBy=fields;
      return this;
    }

    /** Limits the amount of records returned. */
    public limit(limit: number): DBQuery<T>
    {
      this._limit=limit;
      return this;
    }

    /** Specifies an offset for the result records. */
    public offset(offset: number): DBQuery<T>
    {
      this._offset=offset;
      return this;
    }

    /** Parses a single record. */
    private parseSingle(res): T
    {
      if (!res) return null;
      else if (this._table.parse) return this._table.parse(res);
      else return <T>res;
    }

    /** Parses multiple records. */
    private parseMany(res): T[]
    {
      if (!res || !res.resource)
        return [];
      if (this._table.parse) return $q(<T[]>res.resource).Select(x => this._table.parse(x)).ToArray();
      else return <T[]>res.resource;
    }

    /** Retrieves a single records. */
    public get(id: string): JQueryPromise<T>
    {
      var data={};
      if (this._select) data["fields"]=this._select;
      return get(this._url+"/"+id, data).then(res => this.parseSingle(res));
    }

    /** Retrieves multiple records. */
    public find(): JQueryPromise<T[]>
    {
      var data={};
      if (this._select) data["fields"]=this._select;
      if (this._where) data["filter"]=this._where;
      if (this._orderBy) data["order"]=this._orderBy;
      if (this._groupBy) data["group"]=this._groupBy;
      if (this._limit) data["limit"]=this._limit;
      if (this._offset) data["offset"]=this._offset;
      if (this._related) data["related"]=this._related;
      return get(this._url, data).then(res => this.parseMany(res));
    }
  }

  // init tables
  export var event=new DBTable<MTBEvent>("event", ev => new MTBEvent(ev));
}