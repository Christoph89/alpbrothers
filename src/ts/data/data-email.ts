/*! Alpbrothers - data/data-email.ts
* Copyright Christoph Schaunig 2017
*/

"use strict";

module $alpbros
{
  /** Defines an MTB event registration. */
  export interface IEmail
  {
    template?: string;
    to?: IEmailRecipient[];
    cc?: IEmailRecipient[];
    bcc?: IEmailRecipient[];
    subject?: string;
    body_html?: string;
    from_name?: string;
    from_email?: string;
    reply_to_name?: string;
    reply_to_email?: string;
    [other: string]: any;
  }

  export interface IEmailRecipient
  {
    name?: string;
    email?: string;
  }
}