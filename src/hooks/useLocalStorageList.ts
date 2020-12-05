import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import {
  logGroup,
  logState,
  makeKey,
  stripKey,
  isKey,
} from './config';

export type ExpandedValues<T> = {[key: string]: T};
export type ListValues<T> = ExpandedValues<T> | string[];

export const processKeys = <T>({
  keys,
  expand,
  prefix,
}: {
  keys: string[],
  expand: boolean,
  prefix: string,
}): ListValues<T> => {
  const list = keys
    .filter((it: string) => isKey(it, prefix))
    .map((it: string) => stripKey(it, prefix));
  if (expand) {
    return list.reduce(
      (prev, it: string) => {
        const key = makeKey(it, prefix);
        const val = localStorage.getItem(key)!;
        let ret = null;
        try {
          logState('⚙ LocalStorageList Get Item', key, val);
          ret = JSON.parse(val);
        } catch {
          logState('❌ Could not parse LS data', key, val);
        }
        return {
          ...prev,
          [it]: ret,
        };
      },
      { },
    );
  }
  return list;
};

export const processValue = <T>(
  lsKeys: ListValues<T>,
  defaultValue?: ListValues<T>,
): ListValues<T> | undefined => {
  const shouldNotReturnDefault = lsKeys && Array.isArray(lsKeys)
    ? lsKeys.length > 0
    : true;
  if (shouldNotReturnDefault) {
    return lsKeys;
  }
  return defaultValue;
};

export function useLocalStorageList<T>(
  rawPattern: string | RegExp,
  params?: { defaultValue?: ListValues<T>, expand: true }
): {
  value: ExpandedValues<T> | undefined,
  addItem: (key: string, force?: boolean) => void,
  removeItem: (key: string, force?: boolean) => void,
  updateItem: (key: string, value?: T, force?: boolean) => void,
  refresh: (logText?: string | undefined) => void,
  getKey: (key: string) => string,
};
export function useLocalStorageList<T>(
  rawPattern: string | RegExp,
  params?: { defaultValue?: string[], expand: false }
): {
  value: string[] | undefined,
  addItem: (key: string, force?: boolean) => void,
  removeItem: (key: string, force?: boolean) => void,
  updateItem: (key: string, value?: T, force?: boolean) => void,
  refresh: (logText?: string | undefined) => void,
  getKey: (key: string) => string,
};
export function useLocalStorageList<T>(
  rawPattern: string | RegExp,
  {
    defaultValue,
    expand = false,
  }: {
    defaultValue?: ListValues<T>,
    expand?: boolean,
  } = {},
): {
    value: ListValues<T> | undefined,
    addItem: (key: string, force?: boolean) => void,
    removeItem: (key: string, force?: boolean) => void,
    updateItem: (key: string, value: T, force?: boolean) => void,
    refresh: (logText?: string | undefined) => void,
    getKey: (key: string) => string,
  } {
  const patternIsRegExp = useMemo(
    () => rawPattern instanceof RegExp,
    [rawPattern],
  );
  const pattern: RegExp = useMemo(
    () => (patternIsRegExp ? pattern : new RegExp(`^${rawPattern}`)),
    [patternIsRegExp, rawPattern],
  );
  const [initialLoad, setInitialLoad] = useState(false);
  const [value, setValue] = useState<ListValues<T>>();
  const oldKeys = useRef<ListValues<T>>([]);
  const update = useCallback(
    (logText?: string) => {
      const lsKeys = processKeys<T>({
        keys: Object.keys(localStorage).sort(),
        expand,
        prefix: rawPattern.toString(),
      });
      oldKeys.current = lsKeys;
      if (!logText) {
        logState('⚙ LocalStorageList Get', rawPattern.toString(), lsKeys);
      } else {
        logGroup(
          logText,
          rawPattern.toString(),
          [`Old Value: %c${JSON.stringify(oldKeys.current)}`, 'color: red; text-decoration: underline'],
          [`New Value: %c${JSON.stringify(lsKeys)}`, 'color: green; text-decoration: underline'],
        );
      }
      setValue(processValue(lsKeys, !logText ? defaultValue : undefined));
    },
    [setValue, defaultValue, pattern, expand],
  );
  useEffect(() => {
    if (!initialLoad) {
      setInitialLoad(true);
      update();
    }
  }, [setValue, initialLoad, pattern, rawPattern, defaultValue, expand]);
  useEffect(() => {
    const handler = ({
      storageArea,
      key: k,
    }: StorageEvent) => {
      if (!k) {
        return undefined;
      }
      const isValidKey = isKey(k, rawPattern.toString());
      const isLocalStorage = storageArea === localStorage;
      if (!(isLocalStorage && isValidKey)) {
        return undefined;
      }
      update('⚙ LocalStorage Event');
      return undefined;
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [update, pattern, rawPattern]);
  const updateItem = useCallback(
    (key: string, v?: T, force = false) => {
      if (!force && patternIsRegExp) {
        return undefined;
      }
      const k = force ? makeKey(key) : makeKey(key, rawPattern.toString());
      logState('⚙ LocalStorageList Set', k, JSON.stringify(v));
      localStorage.setItem(k, JSON.stringify(v));
      update();
      return undefined;
    },
    [patternIsRegExp, rawPattern, update],
  );
  const addItem = useCallback(
    (key, force = false) => updateItem(key, {} as T, force),
    [updateItem],
  );
  const removeItem = useCallback(
    (key, force = false) => {
      if (!force && patternIsRegExp) {
        return undefined;
      }
      const k = force ? makeKey(key) : makeKey(key, rawPattern.toString());
      logState('⚙ LocalStorageList Remove', k, {});
      localStorage.removeItem(k);
      update();
      return undefined;
    },
    [patternIsRegExp, update],
  );
  const getKey = useCallback(
    (key: string): string => makeKey(key, rawPattern.toString()),
    [makeKey],
  );
  return {
    value,
    addItem,
    removeItem,
    updateItem,
    refresh: update,
    getKey,
  };
}

export default useLocalStorageList;
