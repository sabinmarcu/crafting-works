import { useCallback, useEffect, useMemo } from 'react';
import { isHex, isRGBA, randomColor } from '../utils/colors';
import { useLocalStorage } from './useLocalStorage';
import { makeKey, stripKey } from './config';

export const labelPrefix = ['label', 'color'].join(':');
export const useLabel = (label: string): [
  string | undefined,
  (input: string) => void,
] => {
  const defaultColor = useMemo(
    randomColor,
    [],
  );
  const key = useMemo(
    () => [labelPrefix, label].join(':'),
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

export const useLabelGuard = (labels: string[]) => {
  useEffect(
    () => {
      if (labels.length === 0) {
        return undefined;
      }
      const match = makeKey(labelPrefix);
      const labelKeys = Object.keys(localStorage)
        .filter((it) => it.startsWith(match))
        .map((it) => stripKey(it, labelPrefix));
      const toRemove = labelKeys
        .filter((it) => !labels.includes(it))
        .map((it) => makeKey(it, `${labelPrefix}:`));
      const toAdd = labels
        .filter((it) => !labelKeys.includes(it))
        .map((it) => makeKey(it, `${labelPrefix}:`));
      toAdd.forEach((it) => localStorage.setItem(it, JSON.stringify(randomColor())));
      toRemove.forEach((it) => localStorage.removeItem(it));
      return undefined;
    },
    [labels],
  );
};

export const useLabelColor = (label: string) => useLabel(label)[0];
