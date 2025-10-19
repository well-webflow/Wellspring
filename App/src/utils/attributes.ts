import { Breakpoints, websiteBreakpoints } from './breakpoints';

/**
 * Prefixes a breakpoint to an attribute
 * @param attrName The attribute as a string
 * @param device The breakpoint
 * @returns A combined string with the breakpoint and attribute
 */
export function getBreakpointAttr(attrName: string, device: string) {
  return attrName + '-' + device;
}

/**
 * Parses an attribute to split the breakpoint from the base attribute
 * @param attrName The attribute as a string
 * @returns This attribute's breakpoint, or null
 */
export function getBaseAttr(attrName: string): {
  breakpoint: string | null;
  baseAttr: string;
} {
  const parts = attrName.split('-');
  const lastWord = parts[parts.length - 1];
  // check if the last word is a breakpoint
  const isBreakpoint = websiteBreakpoints.includes(lastWord as Breakpoints);
  // create the base attr (without the breakpoint)
  const baseAttr = isBreakpoint ? parts.slice(0, -1).join('-') : attrName;
  // get the breakpoint, or null
  const breakpoint = isBreakpoint ? lastWord : null;
  return { breakpoint, baseAttr };
}
