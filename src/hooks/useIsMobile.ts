import {
  useState,
  useEffect,
} from 'react';

import { mobileBreakpoint } from '../config/constants';

const findIsMobile = () => window.matchMedia(mobileBreakpoint).matches;
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(findIsMobile());
  useEffect(
    () => {
      const handler = () => setIsMobile(findIsMobile());
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    },
  );
  return isMobile;
};

export default useIsMobile;
