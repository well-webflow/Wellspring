import { Breakpoints, BreakpointObject, breakpointConfigs } from '../../../utils/breakpoints';

/**
 * Get the cascaded value for a breakpoint
 * If the current breakpoint has no value, use the nearest breakpoint it inherits from, then the base value
 * @param breakpoints The breakpoint values object
 * @param currentBreakpoint The current breakpoint to get value for
 * @param baseValue The base value (non-breakpoint)
 * @returns The cascaded value
 */
export function getCascadedBreakpointValue(
  breakpoints: BreakpointObject | undefined,
  currentBreakpoint: Breakpoints | null,
  baseValue: string
): string {
  if (!currentBreakpoint || !breakpoints) {
    return baseValue;
  }

  const inherited = [currentBreakpoint, ...breakpointConfigs[currentBreakpoint].fallbacks].find(
    (bp) => breakpoints[bp]
  );
  return inherited ? breakpoints[inherited]! : baseValue;
}

/**
 * Check if the current breakpoint value is overridden (has a value set)
 * @param breakpoints The breakpoint values object
 * @param currentBreakpoint The current breakpoint
 * @returns True if the breakpoint has a value set
 */
export function isBreakpointOverridden(
  breakpoints: BreakpointObject | undefined,
  currentBreakpoint: Breakpoints | null
): boolean {
  if (!currentBreakpoint || !breakpoints) {
    return false;
  }

  return !!breakpoints[currentBreakpoint];
}
