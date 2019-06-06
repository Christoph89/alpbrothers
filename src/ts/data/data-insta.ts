/*! Alpbrothers - data/data-gallery.ts
* Copyright Christoph Schaunig 2019
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $alpbros
{
  /** Defines a gallery result. */
  export interface IInstaResult
  {
    /** The gallery images. */
    data: IInstaEntry[];
    /** Gallery meta data. */
    meta: any; // @@todo
    /** Gallery pagination data. */
    pagination: any; // @@todo
  }

  /** Defines an instagram entry. */
  export interface IInstaEntry
  {
    id: string;
    created_time: number;
    caption: { text: string; }
    comments: { count: number; }
    images:
    {
      low_resolution: IInstaImageInfo;
      standard_resolution: IInstaImageInfo;
      thumbnail: IInstaImageInfo;
    }
    likes: { count: number; }
    link: string;
    location: { id: number; latitude: number; longitude: number; name: string; }
    tags: string[];
    type: string;
    user: IInstaUser;
  }

  /** Defines an instagram user. */
  export interface IInstaUser
  {
    id: string;
    username: string;
    full_name: string;
    profile_picture: string;
  }

  /** Defines an instagram image. */
  export interface IInstaImageInfo
  {
    url: string;
    height: number;
    width: number;
  }
}