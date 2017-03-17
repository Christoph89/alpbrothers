/*! Alpbrothers - menu.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros.$menu
{
  var mbtn: JQuery;
  var menu: JQuery;

  /** Initializes the menu. */
  export function init()
  {
    mbtn=$("#menu-btn");
    menu=$("#menu");

    // toggle menu on menu button click
    mbtn.click(function () {
      if ($wrapper.hasClass("menu-opened"))
        close();
      else
        open();
    });

    // close menu when clicking outside of the inner container
    menu.click(function (e) {
      var target=$(e.target);
      if (target.attr("id")=="menu" || target.hasClass("icon"))
        close();
    });
  }

  /** Opens the menu. */
  export function open() 
  {
    mbtn.addClass("fa-close").removeClass("fa-bars");
    
    $wrapper.addClass("menu-opened");
    menu.addClass("opened");
  }

  /** Closes the menu. */
  export function close() 
  {
    mbtn.addClass("fa-bars").removeClass("fa-close");
    $wrapper.removeClass("menu-opened");
    menu.removeClass("opened");
  }
}