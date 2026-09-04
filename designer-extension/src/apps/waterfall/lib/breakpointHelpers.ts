import { Breakpoints, BreakpointObject, websiteBreakpoints } from '../../../utils/breakpoints';

/**
 * Get the breakpoint order from smallest to largest
 */
export const breakpointOrder: Breakpoints[] = [...websiteBreakpoints];

/**
 * Get the cascaded value for a breakpoint
 * If the current breakpoint has no value, cascade from larger breakpoints
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
  // If no active breakpoint, return base value
  if (!currentBreakpoint) {
    return baseValue;
  }

  // If no breakpoints object, return base value
  if (!breakpoints) {
    return baseValue;
  }

  // Get the index of the current breakpoint
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Look for a value in current breakpoint first
  if (breakpoints[currentBreakpoint]) {
    return breakpoints[currentBreakpoint]!;
  }

  // Cascade from larger breakpoints (from smallest to largest after current)
  for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (breakpoints[bp]) {
      return breakpoints[bp]!;
    }
  }

  // If no larger breakpoint has a value, return base value
  return baseValue;
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
