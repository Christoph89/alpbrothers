/*! Alpbrothers - def.ts
* Copyright Christoph Schaunig 2019
*/

"use strict";

module $alpbros
{

  /** Specifies all roles. */
  export enum Roles
  {
    /** WWW role. */
    WWW=1,
    /** Admin role. */
    Admin=2,
    /** Partner role. */
    Partner=3,
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