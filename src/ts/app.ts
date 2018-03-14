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
  export var $cfg: AppCfg;
  export var $res: any;
  export var $meta: Meta;
  export var $metaPromise: JQueryPromise<Meta>;
  export var $url: HashUrl;

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

    export function init(cfg)
    {
      // get config and main elements
      $cfg=cfg;
      $res=$cfg.res;
      localize();

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

      // load meta data from api
      ($metaPromise=$ctx.meta()).done((meta) =>
      {
        // remember meta
        $meta=$cfg.meta=$.extend($cfg.meta||{}, meta);
      });

      // init session and preload main page to ensure it gets the current one on app start
      $ctx.session.refresh()
        .done(() => { setAuthenticated(true); })
        .fail(() => { setAuthenticated(false); })
        .always(() => {
          $pages.preload("main").done(() =>
          {
            // init hash / load start page
            hashChange(undefined, undefined, "immediate")
              .done(() =>
              {
                // preload configured pages
                $q($cfg.preloadPages).ForEach(p => $pages.preload(p));
              });
          });
        });
    }

    export function hashChange(hash?: string, anchor?: string, speed?: string): JQueryPromise<any>
    {
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
        document.title=($res[$url.page] || $res["main"]).title; // change page title
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
        .done(() => { pauseHashChange=pausePopState=popstate=false; }); // enable hash change event
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
      hashChange(hash);
    }

    /** Sets the app authentication state. */
    export function setAuthenticated(authenticated: boolean)
    {
      $doc.toggleClass("authenticated", authenticated).toggleClass("unauthenticated", !authenticated);
    }
  }

  /** Localizes the app config/data */
  function localize()
  {
    // localize event types
    $q(MTBEventTypes).ForEach(x => $.extend(x.Value, $res.eventTypes[x.Key]));

    // init momentjs months
    if ($res.months && $res.months.length)
      moment.updateLocale("en", {
        months: $res.months,
        monthsShort: $q(<string[]>$res.months).Select(x => x.substr(0, 3)).ToArray()
      });
    // init momentjs weekdays
    if ($res.weekdays && $res.weekdays.length)
      moment.updateLocale("en", {
        weekdays: $res.weekdays,
        weekdaysShort: $q(<string[]>$res.weekdays).Select(x => x.substr(0, 3)).ToArray(),
        weekdaysMin: $q(<string[]>$res.weekdays).Select(x => x.substr(0, 2)).ToArray()
      });
  }

  // set skel breakpoints
  skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
    xxsmall: '(max-width: 360px)',
    
    minxlarge: '(min-width: 1680px)',
		minlarge: '(min-width: 1280px)',
		minmedium: '(min-width: 980px)',
		minsmall: '(min-width: 736px)',
		minxsmall: '(min-width: 480px)',
		minxxsmall: '(min-width: 360px)'
	});
}