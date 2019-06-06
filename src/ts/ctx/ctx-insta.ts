/*! Alpbrothers - ctx/ctx-insta.ts
* Copyright Christoph Schaunig 2019
*/

/// <reference path="ctx.ts" />
"use strict";

module $alpbros.$ctx
{
  /** Gets instagram entries. */
  export function getInstaEntries(): JQueryPromise<IInstaEntry[]>
  {
    return $ctx.get("/insta").then((res: IInstaResult) =>
    {
      return res.data;
    });
  }
}