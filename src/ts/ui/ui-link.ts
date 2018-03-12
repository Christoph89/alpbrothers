/*! Alpbrothers - ui-link.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ui.ts" />
"use strict";

module $alpbros.$ui.link
{
  /** Initializes all links */
  export function init(context?: JQuery)
  {
    $("a", context).each(function ()
    {
      initLink($(this));
    });
  }

  /** Initializes the specified link. */
  function initLink(link: JQuery)
  {
    var href=link.attr("href");

    // no href -> no action
    if (!href)
      return;

    // hash -> scroll to
    if (href[0]=="#")
      link.off("click.href").on("click.href", e => 
      {
        // prevent default scrolling
        if (e) e.preventDefault();

        // change hash
        $app.hashChange(link.attr("href"), link.attr("anchor"), link.attr("speed"));
      });
  }
}