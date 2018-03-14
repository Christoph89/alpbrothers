/*! Alpbrothers - cmd.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
/// <reference path="cmd-signin.ts" />
/// <reference path="cmd-signout.ts" />
"use strict";

module $alpbros.$cmd
{
  /** Executes the specified command. */
  export function exec(name: string, args: any): JQueryPromise<any>
  {
    var ctor=$cmd["Cmd"+name[0].toUpperCase()+name.substr(1)];
    if (!ctor)
      return $.Deferred<any>().reject("Cmd "+name+" not found!").promise();
    return (<Cmd>new ctor()).exec(args||{});
  }

  /** Executes the specified command. */
  export function execUrl(url: HashUrl): JQueryPromise<any>
  {
    if (!url || url.page!="cmd" || !url.dest)
      return $.Deferred<any>().reject("Invalid cmd url '"+(url?url.hash:"")+"'").promise();
    return exec(url.dest, url.args);
  }

  /** Specifies an executable command. */
  export class Cmd
  {
    /** Initializes a new instance. */
    constructor()
    {
    }

    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      return $.Deferred<any>().resolve().promise();
    }
  }
}