/*! Alpbrothers - ui.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

module $alpbros.$ui
{
  /** Initializes the UI. */
  export function init()
  {
    // common fixes and init
    $ui.disableAnimationsOnLoad(); // disable animations until page has loaded
    $ui.fixIEFlexbox(); // fix IE flexbox min-height bug
    $ui.fixObjectFit(); // fix object fit
    $ui.checkSvgCompatibility(); // use png if svg is not supported

    // init ui parts
    $ui.initSmoothScroll(); // init smooth scrolling buttons
    $ui.initLangButton(); // hide language button on scroll
    $ui.initWrapper(); // init wrapper element
    $ui.initItems(); // init item lists
    $ui.gallery.init(); // init gallery
    $ui.menu.init(); // menu
    $ui.maps.init(); // google maps
  }

  /** Initializes the UI for smooth scrolling. */
  export function initSmoothScroll()
  {
    $('.smooth-scroll').scrolly();
    $('.smooth-scroll-middle').scrolly({ anchor: 'middle' });
  }

  /** Initializes the language button. */
  export function initLangButton()
  {
    var langBtn=$("#lang-btn");
    var check=() =>
    {
      var winHeight=$window.height();
      var scrollHeight=$window.scrollTop();
      langBtn.toggleClass("hidden", scrollHeight>(winHeight/2));
    };
    $window.scroll(check);
    $window.resize(check);
    check();
  }

  /** Disables animations until the page has loaded. */
  export function disableAnimationsOnLoad()
  {
    $body.addClass('is-loading');
    $window.on('load', function ()
    {
      window.setTimeout(function ()
      {
        $body.removeClass('is-loading');
      }, 100);
    });
  }

  /** Checks for SVG compatibility and changes images to use .png if .svg is not supported. */
  export function checkSvgCompatibility()
  {
    if (Modernizr.svgasimg)
      return;
    $("img.svg").each((i, el) =>
    {
      convertSvgToPng($(el));
    });
  }

  /** Replaces .svg by .png of the specified image source. */
  export function convertSvgToPng(img: JQuery)
  {
    var src=img.attr("src");
    img.attr("src", src.replace(".svg", ".png"));
  }

  /** Fixes IE flexbox min-height bug. */
  export function fixIEFlexbox()
  {
    if (skel.vars.browser!='ie')
      return;

    var flexboxFixTimeoutId;
    $window.on('resize.flexbox-fix', function ()
    {
      var $x=$('.fullscreen');
      clearTimeout(flexboxFixTimeoutId);
      flexboxFixTimeoutId=setTimeout(function ()
      {
        if ($x.prop('scrollHeight')>$window.height())
          $x.css('height', 'auto');
        else
          $x.css('height', '100vh');
      }, 250);
    }).triggerHandler('resize.flexbox-fix');
  }

  /** Fixes object fix. */
  export function fixObjectFit()
  {
    if (skel.canUse('object-fit'))
      return;

    $('.banner .image, .spotlight .image').each(function (idx, el)
    {
      var $el=$(el),
        $img=$el.children('img'),
        positionClass=$el.parent().attr('class').match(/image-position-([a-z]+)/);

      // set image.
      $el.css('background-image', 'url("'+$img.attr('src')+'")')
        .css('background-repeat', 'no-repeat')
        .css('background-size', 'cover');

      // set position.
      switch (positionClass.length>1? positionClass[1]:'') 
      {
        case 'left': $el.css('background-position', 'left'); break;
        case 'right': $el.css('background-position', 'right'); break;
        case 'center':
        default: $el.css('background-position', 'center'); break;
      }

      // hide original.
      $img.css('opacity', '0');
    });
  }

  /** Initializes all item lists. */
  export function initItems()
  {
    scrollex(".items", { delay: 50 })
      .children()
      .wrapInner('<div class="inner"></div>');
  } 

  /** Initializes the wrapper element. */
  export function initWrapper()
  {
    scrollex($wrapper.children());
  }

  /** Executes jquery scrollex. */
  export function scrollex(selector: string, opt?: JQueryScrollexOptions): JQuery;
  export function scrollex(elements: JQuery, opt?: JQueryScrollexOptions): JQuery;
  export function scrollex(arg: any, opt?: JQueryScrollexOptions): JQuery
  {
    // get elements
    var elements: JQuery=(typeof arg=="string")?$(arg):arg;

    // extend default options
    opt=$.extend(<JQueryScrollexOptions>{
      top: '30vh',
      bottom: '30vh',
      initialize: function () { $(this).addClass('is-inactive'); },
      terminate: function () { $(this).removeClass('is-inactive'); },
      enter: function () { $(this).removeClass('is-inactive'); },
      leave: function () 
      {
        var el=$(this);
        if (el.hasClass('onscroll-bidirectional'))
          el.addClass('is-inactive');
      }
    }, opt);

    // execute jquery scrollex plugin
    return elements.scrollex(opt);
  }
}