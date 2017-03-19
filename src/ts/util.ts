/*! Alpbrothers - util.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros.$util
{
  /** Checks for SVG compatibility and changes images to use .png if .svg is not supported. */
  export function checkSvgCompatibility()
  {
    if (Modernizr.svgasimg)
      return;
    $("img.svg").each((i, el) => {
      convertSvgToPng($(el));
    });
  }

  /** Replaces .svg by .png of the specified image source. */
  export function convertSvgToPng(img: JQuery)
  {
    var src=img.attr("src");
    img.attr("src", src.replace(".svg", ".png"));
  }
}