import { mobileBreakpoint } from '../config/constants';
import { useMatchMedia } from './useMatchMedia';

export const useIsMobile = () => useMatchMedia(mobileBreakpoint);

export default useIsMobile;
