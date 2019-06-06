/*! Alpbrothers - ui-instagallery.ts
* Copyright Christoph Schaunig 2019
*/

/// <reference path="ui.ts" />
"use strict";

module $alpbros.$ui.instagallery
{
  /** Initializes all insta galleries. */
  export function init(context?: JQuery)
  {
    $(".instagallery", context).q().ForEach(x => initGallery(x));
  }

  function initGallery(cnt: JQuery)
  {
    var gallery=$("<div>")
    .addClass("gallery "+cnt[0].className.replace("instagallery", ""))
    .attr("amount", cnt.attr("amount"))
    .attr("large", cnt.attr("large"))
    .attr("medium", cnt.attr("medium"))
    .attr("small", cnt.attr("small"))
    .attr("xsmall", cnt.attr("xsmall"))
    .appendTo(cnt);

    var max=parseInt(cnt.attr("amount"));
    var types=cnt.attr("type").split(" ");

    // remove attr from instagallery cnt
    cnt[0].className="instagallery";
    cnt.removeAttr("amount");
    cnt.removeAttr("large");
    cnt.removeAttr("medium");
    cnt.removeAttr("small");
    cnt.removeAttr("xsmall");

    // load insta entries
    $ctx.getInstaEntries().then(entries => 
    {
      var qx=$q(entries)
        .OrderByDescending(x => x.created_time)
        .Where(x => types.indexOf(x.type)>-1)
        .Take(max);

      qx.ForEach(entry =>
      {
        // append entry
        gallery.append(getEntryElement(entry));
      });

      // init gallery
      $ui.gallery.init(cnt);
    });
  }

  function getEntryElement(entry: IInstaEntry)
  {
    return '<article>'+
      '<a href="'+entry.images.standard_resolution.url+'" class="image"><img src="'+entry.images.standard_resolution.url+'" alt="" /></a>'+
      '<div class="caption"><h3></h3></div>'+
    '</article>';
  }
}