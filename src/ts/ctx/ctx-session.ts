/*! Alpbrothers - ctx-session.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ctx.ts" />
"use strict";

module $alpbros.$ctx.session
{
  /** Specifies a session. */
  export interface Session
  {
    email: string;
    first_name: string;
    host: string;
    id: number;
    is_sys_admin: boolean;
    last_login_date: string;
    last_name: string;
    name: string;
    role: string;
    role_id: Roles;
    session_id: string;
    session_token: string;
  }

  const sessionCookie="alpbros_session";
  /** The current session. */
  export var current: Session=null;

  /** Signs in the specified user. */
  export function signin(email: string, pwd: string, duration: number=0): JQueryPromise<Session>
  {
    return post("/user/session", { email: email, password: pwd, duration: duration||0 })
      .then(session => 
      {
        // set session
        return setSession(session);
      })
      .fail((jqXHR, status, err) => 
      {
        // cancel session
        return setSession(null);
      });
  }

  /** Signs in the specified user by hash. */
  export function hashauth(hash: string): JQueryPromise<Session>
  {
    return post("/hashauth", { hash: hash })
      .then(session => 
      {
        // set session
        return setSession(session);
      })
      .fail((jqXHR, status, err) => 
      {
        // cancel session
        return setSession(null);
      });
  }
  
  /** Signs out the current user. */
  export function signout(): JQueryPromise<any>
  {
    if (!current || !current.session_token)
      return $.Deferred<any>().resolve().promise();
    return del("/user/session", { "session_token": current.session_token })
      .then(() => 
      {
        // cancel session
        return setSession(null);
      });
  }

  /** Refreshes the current session. */
  export function refresh() : JQueryPromise<Session>
  {
    // try get session from cookie
    var token=current?current.session_token:null;
    if (!token)
      token=Cookies.get(sessionCookie);
    if (!token)
      return $.Deferred<any>().reject().promise();
    return put("/user/session", { "session_token": token })
      .then((session) => 
      {
        // refresh session
        return setSession(session);
      })
      .fail((jqXHR, status, err) => 
      {
        // cancel session
        return setSession(null);
      });
  }

  /** Sets the current session and cookie. */
  function setSession(session: Session): Session
  {
    current=session;
    if (current)
      Cookies.set(sessionCookie, current.session_token, { expires: 1 });
    else
      Cookies.remove(sessionCookie);
    return current;
  }
}