import { mobileBreakpoint, tabletBreakpoint } from '../config/constants';
import { useMatchMedia } from './useMatchMedia';

export const useIsMobile = () => useMatchMedia(mobileBreakpoint);
export const useIsTablet = () => useMatchMedia(tabletBreakpoint);
