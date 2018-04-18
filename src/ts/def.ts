/*! Alpbrothers - def.ts
* Copyright Christoph Schaunig 2017
*/

"use strict";

module $alpbros
{

  /** Specifies all roles. */
  export enum Roles
  {
    /** Partner role. */
    Partner=2,
    /** WWW role. */
    WWW=3,
    /** Admin role. */
    Admin=4
  }

  export interface HashUrl
  {
    hash: string;
    page?: string;
    dest?: string;
    args?: any;
  }

  export enum MTBLevel
  {
    Everyone=0,
    Beginner=1<<0,
    Advanced=1<<1,
    All=1<<0 | 1<<1,
  }
}