/*! Alpbrothers - app.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros
{
  export var $window=$(window);
  export var $doc=$(document.documentElement);
  export var $body=$(document.body);
  export var $main=$("#main.page");
  export var $res: any;
  export var $url: HashUrl;

  /** Main application */
  export module $app
  {
    /** History length on app start. */
    var historyLength: number;
    /** En-/disables the hash change event. */
    var pauseHashChange=false;
    /** En-/disables the popstate event. */
    var pausePopState=false;
    /** True if the current hash change is a history pop/back. */
    var popstate=false;

    /** Initializes the app. */
    export function init(cfg)
    {
      // get config and main elements
      $cfg.init(cfg);

      // disable automatic scrolling on history changes
      if (Modernizr.history)
      {
        history.scrollRestoration="manual";
        historyLength=history.length;
      }

      // listen for hash change
      $window.on("hashchange", function() { 
        if (!pauseHashChange)
          hashChange();
      });
      // listen history pop/back
      if (Modernizr.history)
        $window.on("popstate", function() {
          if (!pausePopState)
            popstate=true;
        });

      // init session refresh
      var refreshTimeout: any;
      $doc.click(() => 
      {
        if (refreshTimeout)
          return;
        $ctx.session.refresh()
          .done(() => { setAuthenticated(true); })
          .fail(() => { setAuthenticated(false); });
        refreshTimeout=setTimeout(() => {
          refreshTimeout=null;
        }, 15000); // wait at least 15sec
      });

      // init app data
      $data.init();

      // show cookie agreement if not already agreed
      setCookieAgreement($ctx.session.hasCookieAgreement());

      // init session and preload main page to ensure it gets the current one on app start
      $ctx.session.refresh()
        .done(() => { setAuthenticated(true); })
        .fail(() => { setAuthenticated(false); })
        .always(() => 
        {
          $pages.preload("main").done(() =>
          {
            // init hash / load start page
            hashChange(undefined, undefined, "immediate")
              .done(() =>
              {
                // preload configured pages
                $q($cfg.pages).Where(p => p.Value.preload).ForEach(p => $pages.preload(p.Key));
              });
          });
        });
    }

    export function hashChange(hash?: string, anchor?: string, speed?: string): JQueryPromise<any>
    {
      // go back
      if (hash==="#back")
      {
        $app.back();
        return;
      }
      else if (hash=="#back-history")
      {
        $app.back("#history");
        return;
      }

      // disable hash change event
      pauseHashChange=true;
      if (!popstate) pausePopState=true;

      // get url
      $url=$util.parseUrl(hash || window.location.hash);

      // is command?
      if ($url.page=="cmd")
        return $cmd.execUrl($url)
          .fail((err) =>
          {
            console.error(err);
            return $app.back();
          });
      
      // is page change?
      var isPageChange=$pages.current && $url.page!=$pages.current.name;

      // set location hash
      if (hash && window.location.hash!=hash)
      {
        if (isPageChange)
        {
          $ui.$backBtn.attr("href", window.location.hash); // set back btn
          window.location.hash=hash; // use location.hash to remember page change in history
        }
        if (Modernizr.history)
          setHash(hash); // set history and hash without triggering hashchange event
      }

      if (isPageChange) 
      {
        speed="immediate"; // scroll immediate on page change
        document.title=getTitle($url); // change page title
        if (!popstate) $pages.current.remOffset($window.scrollTop()); // remember scroll position on page change, but not on popstate
      }

      // check anchor and speed args
      var args=$url.args;
      if (args)
      {
        if (args.anchor) anchor=args.anchor;
        if (args.speed) speed=args.speed;
      }

      // smooth scroll
      return $ui.scrollTo($url, anchor, speed, popstate)
        .fail(err => { back(); }) // go back on error
        .done(() => { pauseHashChange=pausePopState=popstate=false; }); // enable hash change event
    }

    /** Gets the title for the specified url. */
    function getTitle(url: HashUrl)
    {
      var p=$res[url.page];
      var d=url.dest && p?p[url.dest]:null;
      if (d && d.title)
        return d.title;
      else if (p && p.title)
        return  p.title;
      return $res["main"].title;
    }

    /** Set's the hash without triggering hashchange event. Only cal if history api is supported! */
    export function setHash(hash: string)
    {
      history.replaceState(hash, undefined, hash);
    }

    /** Go home. */
    export function home()
    {
      hashChange("#/");
    }

    /** Go back. */
    export function back(hash?: string)
    {
      popstate=true; // next hashchange will run as popstate
      if (!hash) hash=$ui.$backBtn.attr("back") || $pages.current && $pages.current.defaultBack() || "#/";
      if (hash=="#history")
        history.back();
      else
        hashChange(hash);
    }

    /** Sets the app authentication state. */
    export function setAuthenticated(authenticated: boolean)
    {
      $doc.toggleClass("authenticated", authenticated)
          .toggleClass("unauthenticated", !authenticated)
          .toggleClass("role-public", $ctx.session.isPublic())
          .toggleClass("role-partner", $ctx.session.isPartner())
          .toggleClass("role-admin", $ctx.session.isAdmin());
    }

    /** Shows/hides the cookie agreement. */
    export function setCookieAgreement(agreed: boolean)
    {
      $doc.toggleClass("missing-cookie-agreement", !agreed);
    }

     /** Gets the specified confirm url. */
     export function confirmUrl(title: string, text: string, okUrl: string);
     export function confirmUrl(res: any);
     export function confirmUrl(res: any, text?: string, okUrl?: string)
     {
       if (typeof res=="string")
       {
         var title=res;
         res={ title: title, text: text, ok: okUrl };
       }
       var url: string;
       for (var prop in res)
       {
         if (!url) url="#/confirm?";
         else url+="&";
         url+=encodeURIComponent(prop)+"="+encodeURIComponent(res[prop]);
       }
       return url;
     }

     /** Shows the specified confirm. */
     export function confirm(title: string, text: string, okUrl: string);
     export function confirm(res: any);
     export function confirm(res: any, text?: string, okUrl?: string)
     {
       hashChange(confirmUrl(res, text, okUrl));
     }

    /** Gets the specified choice url. */
    export function choiceUrl(title: string, text: string, items: { [text: string]: string });
    export function choiceUrl(res: any);
    export function choiceUrl(res: any, text?: string, items?: { [text: string]: string })
    {
      if (typeof res=="string")
      {
        var title=res;
        res=$q(items).ToObject(x => (x.Key[0]=="@"?"":"@")+x.Key, x => x.Value);
        res.title=title;
        res.text=text;
      }
      var url: string;
      for (var prop in res)
      {
        if (!url) url="#/choice?";
        else url+="&";
        url+=encodeURIComponent(prop)+"="+encodeURIComponent(res[prop]);
      }
      return url;
    }

    /** Shows the specified choices. */
    export function choice(title: string, text: string, items: { [text: string]: string });
    export function choice(res: any);
    export function choice(res: any, text?: string, items?: { [text: string]: string })
    {
      hashChange(choiceUrl(res, text, items));
    }
  }

  // set skel breakpoints
  $ui.initSkel();
}