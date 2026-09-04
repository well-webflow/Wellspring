import { websiteBreakpoints } from './breakpoints';

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
  // Check each breakpoint from longest to shortest to handle multi-word breakpoints
  const sortedBreakpoints = [...websiteBreakpoints].sort((a, b) => b.length - a.length);

  for (const bp of sortedBreakpoints) {
    if (attrName.endsWith(`-${bp}`)) {
      const baseAttr = attrName.slice(0, -(bp.length + 1)); // +1 for the dash
      return { breakpoint: bp, baseAttr };
    }
  }

  // No breakpoint found
  return { breakpoint: null, baseAttr: attrName };
}
