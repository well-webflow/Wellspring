// Breakpoints
export const websiteBreakpoints = ['lmobile', 'tablet', 'desktop', 'large', 'xlarge'] as const;

export type Breakpoints = 'lmobile' | 'tablet' | 'desktop' | 'large' | 'xlarge';

export type BreakpointObject = Record<Breakpoints, string>;
