/* jquery.scrolly.d.ts - (c) Christoph Schaunig 2019 */

interface JQueryScrollyOptions
{
  check?: (e: JQueryEventObject) => boolean;
  immediate?: boolean|string;
  anchor?: string;
}

interface JQuery
{
  scrolly(opt?: JQueryScrollyOptions): JQuery;
}