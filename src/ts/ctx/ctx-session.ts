/*! Alpbrothers - ctx/ctx-session.ts
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
  const agreementCookie="alpbros_cookie_agreement";
  /** The current session. */
  export var current: Session=null;
  /** Promise to wait for session interactions. */
  var _wait: JQueryDeferred<any>=$.Deferred<any>().resolve();

  /** Returns the session token. */
  export function token() : string
  {
    return (current ? current.session_token : null) || Cookies.get(sessionCookie);
  }

  /** Returns the promise to wait for session interactions. */
  export function wait(): JQueryPromise<any>
  {
    return _wait.promise();
  }

  /** Signs in the specified user. */
  export function signin(email: string, pwd: string, duration: number=0): JQueryPromise<Session>
  {
    if (!_wait) _wait=$.Deferred<any>();
    var data={ email: email, password: pwd };
    if (duration) data["duration"]=duration;
    else data["remember_me"]=true;
    console.debug("sign in "+JSON.stringify(data));
    return post("/user/session", data)
      .always(() => 
      {
        // resolve session promise
        if (_wait) _wait.resolve();
      })
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
    if (!_wait) _wait=$.Deferred<any>();
    return post("/hashauth", { hash: hash })
      .always(() => 
      {
        // resolve session promise
        if (_wait) _wait.resolve();
      })
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
    if (!_wait) _wait=$.Deferred<any>();
    if (!current || !current.session_token)
    {
      if (_wait) _wait.resolve(); // resolve session promise
      return $.Deferred<any>().resolve().promise();
    }
    console.debug("sign out");
    return del("/user/session")
      .always(() => 
      {
        // resolve session promise
        if (_wait) _wait.resolve();
      })
      .then(() => 
      {
        // cancel session
        return setSession(null);
      });
  }

  /** Refreshes the current session. */
  export function refresh() : JQueryPromise<Session>
  {
    if (!_wait) _wait=$.Deferred<any>();
    // try get session from cookie
    var token=current?current.session_token:null;
    if (!token)
      token=Cookies.get(sessionCookie);
    console.debug("refresh session "+token);
    if (!token)
    {
      if (_wait) _wait.resolve(); // resolve session promise
      return $.Deferred<any>().reject().promise();
    }
    return put("/user/session")//, { "session_token": token })
      .always(() => 
      {
        // resolve session promise
        if (_wait) _wait.resolve();
      })
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
    console.debug("set session "+JSON.stringify(session));
    current=session;
    if (current)
      Cookies.set(sessionCookie, current.session_token, { expires: 1 });
    else
      Cookies.remove(sessionCookie);
    return current;
  }

  function role(): string
  {
    var r=(current?current.role:"")||"";
    return $cfg.roles[r];
  }

  /** Returns whether the specified path is granted. */
  export function granted(path: string): boolean
  {
    var parts=path.split("/").reverse();
    var acl=$cfg.access;
    while (acl && parts.length)
      acl=acl[parts.pop()];
     
    // allow all for default
    if (!acl) 
      return true
    
    return $q(<string[]>acl).Contains(role()) || $q(<string[]>acl).Contains("*");
  }

  /** Returns whether the current user is a public user. */
  export function isPublic()
  {
    return current==null || current.role==null || current.role=="Alpbrothers WWW";
  }

  /** Returns whether the current user is partner. */
  export function isPartner()
  {
    return  current!=null && current.role=="Alpbrothers Partner";
  }

  /** Returns whether the current user is admin. */
  export function isAdmin()
  {
    return  current!=null && current.role=="Alpbrothers Admin";
  }

  /** Returns whether cookies has been agreed. */
  export function hasCookieAgreement(): boolean
  {
    return Cookies.get(agreementCookie)!=null;
  }

  /** Sets the cookie agreement. */
  export function agreeCookies()
  {
    Cookies.set(agreementCookie, "true", { expires: 365 });
  }
}