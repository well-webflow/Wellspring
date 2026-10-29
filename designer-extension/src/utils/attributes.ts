import { Breakpoints, websiteBreakpoints } from './breakpoints';

// Breakpoint suffixes earlier versions wrote, mapped to the breakpoint that replaced them
export const legacyBreakpoints: Record<string, Breakpoints> = { lmobile: 'mobile-large' };

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
  breakpoint: Breakpoints | null;
  baseAttr: string;
} {
  // Check each suffix from longest to shortest so "-mobile-large" isn't read as "-mobile"
  const suffixes = [...websiteBreakpoints, ...Object.keys(legacyBreakpoints)].sort((a, b) => b.length - a.length);

  for (const suffix of suffixes) {
    if (attrName.endsWith(`-${suffix}`)) {
      const baseAttr = attrName.slice(0, -(suffix.length + 1)); // +1 for the dash
      return { breakpoint: legacyBreakpoints[suffix] ?? (suffix as Breakpoints), baseAttr };
    }
  }

  // No breakpoint found
  return { breakpoint: null, baseAttr: attrName };
}
