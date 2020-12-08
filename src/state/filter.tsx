import { createContext, FC, useCallback } from 'react';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';

export type LabelFilterContextType = {
  filterBy: string[],
  addFilter: (input: string) => void
  removeFilter: (input: string) => void
};

export const LabelFilterContext = createContext<LabelFilterContextType>({
  filterBy: [],
  addFilter: () => {},
  removeFilter: () => {},
});

export const uniq = <T extends any>(
  input: T[],
  extract: (input: T) => any = (it) => it,
): T[] => input.filter((it, idx, arr) => arr.findIndex((i) => extract(i) === extract(it)) === idx);

export const storageKey = ['filter', 'label'].join(':');
export const LabelFilterProvider: FC = ({ children }) => {
  const [filterBy, setFilterBy] = useLocalStorageObject<string[]>(
    storageKey,
    [],
  );
  const update = useCallback(
    (input: string[] | ((old: string[]) => string[])) => (Array.isArray(input)
      ? setFilterBy(uniq(input))
      : setFilterBy((t) => uniq(input(t || [])))),
    [setFilterBy],
  );
  const addFilter = useCallback(
    (input: string) => update((f) => [...f, input]),
    [update],
  );
  const removeFilter = useCallback(
    (input: string) => update((f) => f.filter((it) => it !== input)),
    [update],
  );
  return (
    <LabelFilterContext.Provider
      value={{
        filterBy: filterBy || [],
        addFilter,
        removeFilter,
      }}
    >
      {children}
    </LabelFilterContext.Provider>
  );
};
