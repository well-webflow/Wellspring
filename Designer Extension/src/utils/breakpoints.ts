import { breakpointIcons } from '../assets/breakpoint-icons';

// Breakpoints
export const websiteBreakpoints = ['mobile', 'lmobile', 'tablet', 'desktop', 'desktop-small', 'desktop-large'] as const;

export type Breakpoints = 'mobile' | 'lmobile' | 'tablet' | 'desktop' | 'desktop-small' | 'desktop-large';

export type BreakpointObject = Record<Breakpoints, string>;

export interface BreakpointConfig {
  id: Breakpoints;
  displayName: string;
  size: string;
  icon: string;
}

export const breakpointConfigs: Record<Breakpoints, BreakpointConfig> = {
  mobile: {
    id: 'mobile',
    displayName: 'Mobile',
    size: '479px',
    icon: breakpointIcons.mobilePortrait,
  },
  lmobile: {
    id: 'lmobile',
    displayName: 'Mobile Large',
    size: '767px',
    icon: breakpointIcons.mobileLandscape,
  },
  tablet: {
    id: 'tablet',
    displayName: 'Tablet',
    size: '991px',
    icon: breakpointIcons.tablet,
  },
  desktop: {
    id: 'desktop',
    displayName: 'Desktop',
    size: '1024px',
    icon: breakpointIcons.desktop,
  },
  'desktop-small': {
    id: 'desktop-small',
    displayName: 'Desktop Small',
    size: '1280px',
    icon: breakpointIcons.desktopSmall,
  },
  'desktop-large': {
    id: 'desktop-large',
    displayName: 'Desktop Large',
    size: '1440px',
    icon: breakpointIcons.desktopLarge,
  },
};

export function createBreakpoints(): BreakpointObject {
  return {
    mobile: '',
    lmobile: '',
    tablet: '',
    desktop: '',
    'desktop-small': '',
    'desktop-large': '',
  };
}
