import {
  FC, useMemo, createContext, useCallback, useEffect, useContext,
} from 'react';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';
import { LabelType } from '../utils/types';
import { uniq } from '../utils/functions';
import { randomColor } from '../utils/colors';
import { useRecipes } from './recipes-v3';

const extract = ({ name }: LabelType) => name;

export type LabelContextType = {
  labels: LabelType[],
  setColor: (label: string, color: string) => void,
};

export const LabelContext = createContext<LabelContextType>({
  labels: [],
  setColor: () => {},
});

const decode = (
  input: Record<string, string>,
): LabelType[] => Object.entries(input)
  .map(([name, color]) => ({ name, color }));

const encode = (
  input: LabelType[],
): Record<string, string> => input.reduce(
  (prev, { name, color }) => ({
    ...prev,
    [name]: color,
  }),
  {},
);

export const storageKey = 'labels';
export const LabelProvider: FC = ({ children }) => {
  const { labels: recipeLabels } = useRecipes();
  const [store, setLabels] = useLocalStorageObject<Record<string, string>>(
    storageKey,
    {},
  );
  const labels = useMemo(
    () => decode(store || {}),
    [store],
  );
  const update = useCallback(
    (input: LabelType[] | ((old: LabelType[]) => LabelType[])) => (Array.isArray(input)
      ? setLabels(encode(uniq(input, extract)))
      : setLabels((t) => encode(uniq(input(t ? decode(t) : []), extract)))
    ),
    [setLabels],
  );
  const setColor = useCallback(
    (n: string, c: string) => update(
      (t) => t.map(
        ({ name, color }) => (name === n
          ? { name, color: c }
          : { name, color }
        ),
      ),
    ),
    [update],
  );
  useEffect(
    () => {
      if (recipeLabels.length === 0) {
        return undefined;
      }
      const updated = recipeLabels.reduce(
        (prev, it) => ([
          ...prev,
          {
            name: it,
            color: labels.find(({ name }) => name === it)?.color ?? randomColor(),
          } as LabelType,
        ]),
        [] as LabelType[],
      );
      if (updated.length !== labels.length) {
        update(updated);
        return undefined;
      }
      const diff = updated.filter(({ name, color }) => {
        const label = labels.find(({ name: n }) => n === name);
        return !label || label.color !== color;
      });
      if (diff.length > 0) {
        update(updated);
      }
      return undefined;
    },
    [recipeLabels, labels, update],
  );
  return (
    <LabelContext.Provider
      value={{
        labels,
        setColor,
      }}
    >
      {children}
    </LabelContext.Provider>
  );
};

export const useLabels = () => useContext(LabelContext);
export const useLabel = (name: string): [string | undefined, (input: string) => void] => {
  const { labels, setColor } = useLabels();
  const value = useMemo(
    () => labels.find(
      ({ name: n }) => name === n,
    ) || undefined,
    [labels],
  );
  const setter = useCallback(
    (color: string) => value
      && setColor(name, color),
    [value, setColor, name],
  );
  return [value?.color, setter];
};
export const useLabelColor = (name: string) => useLabel(name)[0];
