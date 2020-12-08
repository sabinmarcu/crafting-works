import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';
import { uniq } from '../utils/functions';

export type LabelFilterContextType = {
  filterBy: string[],
  addFilter: (input: string) => void
  removeFilter: (input: string) => void
  toggleFilter: (input: string) => void
};

export const LabelFilterContext = createContext<LabelFilterContextType>({
  filterBy: [],
  addFilter: () => {},
  removeFilter: () => {},
  toggleFilter: () => {},
});

export const storageKey = ['filter', 'label'].join(':');
export const LabelFilterProvider: FC = ({ children }) => {
  const [store, setFilterBy] = useLocalStorageObject<{ filterBy: string[] }>(
    storageKey,
    { filterBy: [] },
  );
  const filterBy = useMemo(
    () => (store?.filterBy ?? [])
      .filter(Boolean)
      .filter((it) => it !== 'undefined'),
    [store?.filterBy],
  );
  const update = useCallback(
    (input: string[] | ((old: string[]) => string[])) => (Array.isArray(input)
      ? setFilterBy({ filterBy: uniq(input) })
      : setFilterBy((t) => ({ filterBy: uniq(input(t?.filterBy || [])) }))
    ),
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
  const toggleFilter = useCallback(
    (input: string) => (filterBy.includes(input)
      ? removeFilter(input)
      : addFilter(input)),
    [filterBy, addFilter, removeFilter],
  );
  return (
    <LabelFilterContext.Provider
      value={{
        filterBy: filterBy || [],
        addFilter,
        removeFilter,
        toggleFilter,
      }}
    >
      {children}
    </LabelFilterContext.Provider>
  );
};

export const useLabelFilter = () => useContext(LabelFilterContext);
export const useLabelFilters = () => useLabelFilter().filterBy;
