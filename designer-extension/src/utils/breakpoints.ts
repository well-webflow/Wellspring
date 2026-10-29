import { breakpointIcons } from '../assets/breakpoint-icons';

// Breakpoints, in the order Webflow's breakpoint bar shows them
export const websiteBreakpoints = [
  'desktop-large',
  'desktop-small',
  'desktop',
  'tablet',
  'mobile-large',
  'mobile',
] as const;

export type Breakpoints = (typeof websiteBreakpoints)[number];

export type BreakpointObject = Partial<Record<Breakpoints, string>>;

export interface BreakpointConfig {
  id: Breakpoints;
  displayName: string;
  size: string;
  icon: string;
  // Breakpoints this one inherits from, nearest first, before falling back to the base value.
  // Matches the Waterfall runtime: like Webflow styles, values cascade outward from Desktop.
  fallbacks: Breakpoints[];
}

export const breakpointConfigs: Record<Breakpoints, BreakpointConfig> = {
  mobile: {
    id: 'mobile',
    displayName: 'Mobile Portrait',
    size: '479px and below',
    icon: breakpointIcons.mobilePortrait,
    fallbacks: ['mobile-large', 'tablet'],
  },
  'mobile-large': {
    id: 'mobile-large',
    displayName: 'Mobile Landscape',
    size: '480px - 767px',
    icon: breakpointIcons.mobileLandscape,
    fallbacks: ['tablet'],
  },
  tablet: {
    id: 'tablet',
    displayName: 'Tablet',
    size: '768px - 991px',
    icon: breakpointIcons.tablet,
    fallbacks: [],
  },
  desktop: {
    id: 'desktop',
    displayName: 'Desktop',
    size: '992px and up',
    icon: breakpointIcons.desktop,
    fallbacks: [],
  },
  'desktop-small': {
    id: 'desktop-small',
    displayName: 'Desktop Small',
    size: '1280px and up',
    icon: breakpointIcons.desktopSmall,
    fallbacks: ['desktop'],
  },
  'desktop-large': {
    id: 'desktop-large',
    displayName: 'Desktop Large',
    size: '1440px and up',
    icon: breakpointIcons.desktopLarge,
    fallbacks: ['desktop-small', 'desktop'],
  },
};

export function createBreakpoints(): BreakpointObject {
  return Object.fromEntries(websiteBreakpoints.map((bp) => [bp, '']));
}
