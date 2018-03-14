/*! Alpbrothers - ctx.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
/// <reference path="ctx-db.ts" />
/// <reference path="ctx-session.ts" />
"use strict";

module $alpbros.$ctx
{
  /** Performs an API request. */
  export function call(verb: string, url: string, data?: any): JQueryPromise<any>
  {
    if (data && (verb=="POST" || verb=="PUT"))
      data=JSON.stringify(data);
    return $.ajax({
      type: verb,
      url: $cfg.ctx.baseurl+url,
      data: data||{},
      accepts: "application/json",
      contentType: "application/json",
      headers: {
        "X-DreamFactory-API-Key": $cfg.ctx.apikey,
        "X-DreamFactory-Session-Token": session.current?session.current.session_token:""
      }
    });
  }

  /** Checks the specified url. */
  function checkUrl(url: string): string
  {
    return url.replace("/db", "/"+$cfg.ctx.db);
  }

  /** Performs an API GET request. */
  export function get(url: string, data?: any): JQueryPromise<any>
  {
    return call("GET", url, data);
  }

  /** Performs an API POST request. */
  export function post(url: string, data?: any): JQueryPromise<any>
  {
    return call("POST", url, data);
  }

  /** Performs an API PUT request. */
  export function put(url: string, data?: any): JQueryPromise<any>
  {
    return call("PUT", url, data);
  }
  
  /** Performs an API DELETE request. */
  export function del(url: string, data?: any): JQueryPromise<any>
  {
    return call("DELETE", url, data);
  }

  /** Loads meta data from the api. */
  export function meta(): JQueryPromise<Meta>
  {
    return get("/meta").then(meta => $parse.meta(meta));
  }
}