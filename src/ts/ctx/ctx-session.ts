/*! Alpbrothers - ctx-session.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ctx.ts" />
"use strict";

module $alpbros.$ctx.session
{
  /** The session token. */
  export var token: string="";

  /** Logs in the specified user. */
  export function login(email: string, pwd: string, duration: number=0)
  {
    post("/user/session", { email: email, password: pwd, duration: duration||0 })
      .done(data => 
      {
        // set session token
        token=data.session_token;
      });
  }
}