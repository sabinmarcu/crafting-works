import React, {
  FC,
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { usePreventScroll } from '../hooks/scroll';

type DrawerContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useDrawer = () => useContext(DrawerContext);
export const DrawerProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen((t) => !t), [setIsOpen]);
  const scrollPrevent = usePreventScroll();
  useEffect(
    () => {
      if (isOpen) {
        scrollPrevent.open();
      } else {
        scrollPrevent.close();
      }
    },
    [isOpen, scrollPrevent],
  );
  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
