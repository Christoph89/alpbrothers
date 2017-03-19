/*! Alpbrothers - ui-gallery.ts
* Copyright Christoph Schaunig 2017
*/

/// <reference path="ref.d.ts" />
"use strict";

interface HTMLElement
{
  _locked: boolean;
}

module $alpbros.$ui.gallery
{
  /** Initializes all galleries. */
  export function init()
  {
    // basic init
    scrollex($('.gallery')
      .wrapInner('<div class="inner"></div>')
      .prepend(skel.vars.mobile? '':'<div class="forward"></div><div class="backward"></div>'), { delay: 50 })
      .children('.inner')
      .css('overflow-y', skel.vars.mobile? 'visible':'hidden')
      .css('overflow-x', skel.vars.mobile? 'scroll':'hidden')
      .scrollLeft(0);

    // initialize lighbox feature
    initLightbox();
  }

  /** Initializes the lightbox feature. */
  function initLightbox()
  {
    $('.gallery.lightbox').on('click', 'a', function (e) 
    {
      var $a=$(this),
        $gallery=$a.parents('.gallery'),
        $modal=$gallery.children('.modal'),
        $modalImg=$modal.find('img'),
        href=$a.attr('href');

      // not an image?
      if (!href.match(/\.(jpg|gif|png|mp4)$/))
        return;

      // prevent default.
      e.preventDefault();
      e.stopPropagation();

      // locked?
      if ($modal[0]._locked)
        return;

      // lock.
      $modal[0]._locked=true;

      // set src, visible and focus
      $modalImg.attr('src', href);
      $modal.addClass('visible');
      $modal.focus();

      // delay and unlock.
      setTimeout(() => { $modal[0]._locked=false; }, 600);

    })
    .on('click', '.modal', function (e)
    {
      var $modal=$(this),
        $modalImg=$modal.find('img');

      // locked?
      if ($modal[0]._locked)
        return;

      // already hidden?
      if (!$modal.hasClass('visible'))
        return;

      // lock.
      $modal[0]._locked=true;

      // clear visible, loaded.
      $modal.removeClass('loaded');

      // delay and hide.
      setTimeout(function ()
      {
        $modal.removeClass('visible'); // hide
        setTimeout(function ()
        {
          // clear src, unlock and set focus to body
          $modalImg.attr('src', '');
          $modal[0]._locked=false;
          $body.focus();
        }, 475);
      }, 125);

    })
    .on('keypress', '.modal', function (event)
    {
      var $modal=$(this);

      // escape? hide modal.
      if (event.keyCode==27)
        $modal.trigger('click');
    })
    .prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
    .find('img')
    .on('load', function (e)
    {
      var $modalImg=$(this),
        $modal=$modalImg.parents('.modal');

      setTimeout(function ()
      {
        // no longer visible?
        if (!$modal.hasClass('visible'))
          return;
        // set loaded.
        $modal.addClass('loaded');
      }, 275);

    });
  }

  /** Initializes all style2 galleries. NOT USED AT THE MOMENT. */
  /*function initStyle2()
  {
    $('.gallery.style2').on('wheel', '.inner', function (e)
    {
      var $this=$(this),
        delta=((<any>e.originalEvent).deltaX*10);

      // cap delta.
      if (delta>0)
        delta=Math.min(25, delta);
      else if (delta<0)
        delta=Math.max(-25, delta);

      // scroll.
      $this.scrollLeft($this.scrollLeft()+delta);

    })
    .on('mouseenter', '.forward, .backward', function (e)
    {
      var $this=$(this),
        $inner=$this.siblings('.inner'),
        direction=($this.hasClass('forward')? 1:-1);

      // clear move interval.
      clearInterval(this._gallery_moveIntervalId);

      // start interval.
      this._gallery_moveIntervalId=setInterval(function ()
      {
        $inner.scrollLeft($inner.scrollLeft()+(5*direction));
      }, 10);

    })
    .on('mouseleave', '.forward, .backward', function (e)
    {
      // clear move interval.
      clearInterval(this._gallery_moveIntervalId);
    });
  }*/
}