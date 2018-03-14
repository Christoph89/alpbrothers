/*! Alpbrothers - pages.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="../ref.d.ts" />
/// <reference path="page-base.ts" />
/// <reference path="page-main.ts" />
/// <reference path="page-events.ts" />
/// <reference path="page-event.ts" />
/// <reference path="page-signin.ts" />
/// <reference path="page-admin.ts" />
"use strict";

module $alpbros.$pages
{
  interface PageCtor { (pageCnt: JQuery, wait: JQueryDeferred<Page>): void }
  var waiting: { [name: string]: JQueryPromise<Page> }={};
  var pages: { [name: string]: Page }={};
  export var current: Page;

  /** Loads the specified page. */
  export function load(name: string, preload?: boolean): JQueryPromise<Page>
  {
    // already waiting?
    var wait=<JQueryDeferred<Page>>waiting[name];

    // not already waiting
    if (!wait)
    {
      // create promise
      var wait=$.Deferred<Page>().fail((err) => { fail(err, name, preload); });

      // get page
      var page: Page=get(name);
      var ctor: typeof Page;

      // does page and ctor exist?
      if (!page && !(ctor=getCtor(name)))
        return wait.reject().promise(); // page and ctor does not exist -> reject
      else if (page)
        wait.resolve(page); // page exists -> page load
      else // page does not exist -> init page befor load
      {
        if (!preload) $ui.loader.show();
        getPageCnt(name).then(pageCnt => 
        {
          // create page
          page=pages[name]=new ctor(name, pageCnt, wait);
          if (ctor==$pages["Page"]) wait.resolve(page); // default page -> resolve
        }, () => { wait.reject(); });
      }
    }
      
    // load page
    // it's necessary to remember the promise to prevent duplicate loading while preloading
    return (waiting[name]=wait.then(page =>
      {
        if (!page.load || preload)
          return page;
        var waitLoad=$.Deferred<Page>();
        page.load(waitLoad);
        return <any>waitLoad;
      })
      .then(page => {
      // init current page on app start, should be main page
      if (!current)
        current=page;

      // hide loader and set current page if not preloading
      if (!preload)
      {
        $ui.loader.hide();
        if (current!=page)
        {
          // hide old current
          if (current) 
          {
            current.pageCnt.removeClass("current").addClass("hidden");
            current.pageCnt.trigger("pagehide");
          }

          // set new current
          (current=page).pageCnt.addClass("current").removeClass("hidden");
          current.pageCnt.trigger("pageload");
        }
        // set back btn
        $ui.$backBtn.toggleClass("hidden", current==get("main"));
      }
      return page;
    })).fail((err) => { fail(err, name, preload); }); // catch fail
  }

  /** Preloads the specified page. */
  export function preload(name: string): JQueryPromise<Page>
  {
    return load(name, true);
  }

  function fail(err: any, name: string, preload: boolean)
  {
    $ui.loader.hide();
    delete waiting[name];
    if (!preload) $app.back();
    console.error("Could not load page "+name+"! "+err);
  }

  function getPageCnt(name: string): JQueryPromise<JQuery>
  {
    var pageCnt=$("#"+name+".page");
    if (pageCnt.length>0)
      return $.Deferred<JQuery>().resolve(pageCnt).promise();
    return $.ajax({
      type: "GET",
      url: $cfg.root+"pages/"+name+".html"
    }).then(pageHtml => 
    {
      // any page html?
      if (!pageHtml)
      pageHtml='<div id="'+name+'"></div>';
    
      // append page cnt
      pageCnt=$(pageHtml);
      $body.append(pageCnt);

      return pageCnt;
    });
  }

  /** Returns the constructor for the specified page. */
  function getCtor(name: string): typeof Page
  {
    // check if page exists
    if ($cfg.pages.indexOf(name)<0)
    {
      console.error("Missing page "+name);
      return null;
    }
    
    // get page class -> convention = NamePage
    name=name[0].toUpperCase()+name.substr(1);
    return $pages["Page"+name] || Page;
  }

  /** Gets the specified page container. */
  export function get(name: string): Page
  {
    return pages[name];
  }
}