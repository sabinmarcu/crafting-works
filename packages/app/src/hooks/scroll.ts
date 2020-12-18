import {
  useState,
  useCallback,
  useEffect,
} from 'react';

export const usePreventScroll = () => {
  const [active, setOpen] = useState<boolean>(false);
  const onOpen = useCallback(
    () => setOpen(true),
    [setOpen],
  );
  const onClose = useCallback(
    () => setOpen(false),
    [setOpen],
  );
  useEffect(
    () => {
      if (active) {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
        document.body.style.touchAction = 'none';
      } else {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.touchAction = 'pan-y';
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    },
    [active],
  );
  return {
    open: onOpen,
    close: onClose,
  };
};
