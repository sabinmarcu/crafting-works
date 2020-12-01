import React, {
  FC,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

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
