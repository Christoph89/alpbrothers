/* skel.d.ts - (c) Christoph Schaunig 2017 */

interface SkelBreakpoints
{
  xlarge: string;
  large: string;
  medium: string;
  small: string;
  xsmall: string;
  xxsmall: string;
}

interface SkelVars
{
  browser: string;
  mobile: boolean;
}

interface SkelStatic
{
  vars: SkelVars;
  breakpoints(breakpoints: SkelBreakpoints): void;
  canUse(feature: string): boolean;
}

declare var skel: SkelStatic;