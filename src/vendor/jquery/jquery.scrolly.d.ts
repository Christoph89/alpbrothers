/* jquery.scrolly.d.ts - (c) Christoph Schaunig 2017 */

interface JQueryScrollyOptions
{
  anchor?: string;
}

interface JQuery
{
  scrolly(opt?: JQueryScrollyOptions): JQuery;
}