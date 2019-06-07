/*! Alpbrothers - cmd/cmd-test.ts
* Copyright Christoph Schaunig 2019
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros.$cmd
{
  /** Sign out command. */
  export class CmdInstaAuth
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      return $ctx.get("/system/lookup/"+$cfg.instameta_id)
        .always(() => {  $ui.loader.hide(); }) // always hide loader
        .then(res =>
        {
          // redirect to insta auth
          var meta=JSON.parse(res.value);
          var url=meta.redirectUrl+"?api_key="+$cfg.ctx.apikey; //+"&session_token="+$ctx.session.token(); //@@toto insta looses second url param at the moment
          window.open("https://api.instagram.com/oauth/authorize/?client_id="+meta.clientId+"&redirect_uri="+url+"&response_type=code");
        })
        .fail((jqXHR, status, err) => 
        { 
          // log error
          console.error(err);
        });  
    }
  }
}