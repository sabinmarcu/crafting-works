import { useCallback, useMemo } from 'react';
import { isHex, isRGBA, randomColor } from '../utils/colors';
import { useLocalStorage } from './useLocalStorage';

export const useLabel = (label: string): [
  string | undefined,
  (input: string) => void,
] => {
  const defaultColor = useMemo(
    randomColor,
    [],
  );
  const key = useMemo(
    () => ['color', label].join(':'),
    [label],
  );
  const [color, setColor] = useLocalStorage(
    key,
    defaultColor,
  );
  const setter = useCallback(
    (value: string) => {
      if (isHex(value) || isRGBA(value)) {
        setColor(value);
      }
    },
    [setColor],
  );
  return [color, setter];
};

export const useLabelColor = (label: string) => useLabel(label)[0];
