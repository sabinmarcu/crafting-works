import {
  useState, useEffect, Dispatch, SetStateAction, useCallback,
} from 'react';

import {
  // logGroup,
  logState,
  makeKey,
  // isKey,
  makeType,
  isType,
} from './config';
import { usePrevious } from './usePrevious';

type PairType = { key: string, value: any };
const makePairs = (
  obj: any,
  prefix: string,
): PairType[] => Object.entries(obj)
  .reduce(
    (prev, [k, v]) => {
      const key = [prefix, k].join(':');
      return [
        ...prev,
        ...(typeof v === 'object'
          ? [
            { key, value: makeType(Array.isArray(v) ? 'array' : 'object') },
            ...makePairs(v, key),
          ]
          : [{ key, value: v }]
        ),
      ];
    },
    [] as PairType[],
  ) as PairType[];

const readPairs = (prefix: string, type = 'object'): any => {
  const test = new RegExp(`^${prefix}:[^:]+$`);
  const keys: {key: string, value: any}[] = Object.keys(localStorage)
    .sort()
    .filter((it) => test.test(it))
    .map((it) => {
      let value = localStorage.getItem(it);
      if (!value) {
        return undefined;
      }
      const t = isType(value);
      if (t) {
        value = readPairs(it, t[1]) || value;
      }
      return { key: it.replace([prefix, ''].join(':'), ''), value };
    })
    .filter(Boolean) as {key: string, value: any}[];
  const res = keys.reduce(
    (prev, { key, value }) => ({
      ...prev,
      [key]: value,
    }), {},
  );
  switch (type) {
    case 'array': return Array.from({
      ...res,
      length: keys.reduce(
        (prev, { key }) => Math.max(
          parseInt(key, 10),
          prev,
        ), 0,
      ) + 1,
    });
    case 'object': return res;
    default: return undefined;
  }
};

enum DiffActions {
  set,
  remove,
}
type DiffPair = {
  key: string,
  action: DiffActions,
  value?: any,
};
const diff = (orig: any, target: any, prefix?: string): DiffPair[] => {
  const origKeys = Object.keys(orig);
  const targetKeys = Object.keys(target);
  const toRemove = origKeys.filter((it) => !targetKeys.includes(it))
    .map((it) => ({ key: [prefix, it].join(':'), action: DiffActions.remove }));
  const toAdd = targetKeys.filter((it) => !origKeys.includes(it))
    .reduce(
      (prev, it) => [
        ...prev,
        {
          key: [prefix, it].join(':'),
          value: (typeof target[it] === 'object'
            && (Array.isArray(target[it])
              ? makeType('array')
              : makeType('object')))
            || target[it],
          action: DiffActions.set,
        },
        ...makePairs(target[it], [prefix, it].join(':')),
      ],
      [] as PairType[],
    ).map((it) => ({ ...it, action: DiffActions.set }));
  const toChange = origKeys.filter((it) => targetKeys.includes(it))
    .filter((it) => typeof orig[it] !== 'object')
    .filter((it) => orig[it] !== target[it])
    .map((it) => ({ key: [prefix, it].join(':'), value: target[it], action: DiffActions.set }));
  return [
    ...toRemove,
    ...toAdd,
    ...toChange,
    ...origKeys.filter((it) => targetKeys.includes(it))
      .filter((it) => typeof orig[it] === 'object')
      .reduce(
        (prev, it) => [
          ...prev,
          ...diff(orig[it], target[it], [prefix, it].join(':')),
        ],
        [] as DiffPair[],
      ) as DiffPair[],
  ].filter(Boolean);
};

export const useLocalStorageObject = (
  key: string,
  defaultValue?: any,
): [any, Dispatch<SetStateAction<any>>] => {
  const prevKey = usePrevious(key);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [value, setValue] = useState<any>();
  useEffect(() => {
    if (!initialLoad || prevKey !== key) {
      setInitialLoad(true);
      const realKey = makeKey(key);
      const val = localStorage.getItem(realKey);
      if (val) {
        setValue(readPairs(realKey));
      } else {
        setValue(defaultValue);
        localStorage.setItem(realKey, makeType('object'));
        if (localStorage.getItem(realKey)) {
          makePairs(defaultValue, realKey)
            .forEach(({ key: k, value: v }) => localStorage.setItem(k, v));
        }
      }
    }
  }, [initialLoad, key, defaultValue]);
  const diffUpdate = useCallback(
    (input: any) => {
      const realKey = makeKey(key);
      const diffs = diff(readPairs(realKey), input, realKey);
      if (diffs) {
        logState('⚙ LocalStorageObject Set', key, value);
        diffs
          .forEach(({ key: k, value: v, action }) => (action === DiffActions.remove
            ? localStorage.removeItem(k)
            : localStorage.setItem(k, v)));
      }
    },
    [value, setValue, key],
  );
  useEffect(() => {
    if (!initialLoad) {
      return undefined;
    }
    if (!value) {
      logState('⚙ LocalStorageObject Remove', key, value);
      localStorage.removeItem(makeKey(key));
    }
    diffUpdate(value);
    return undefined;
  }, [key, value, initialLoad, diffUpdate]);
  // useEffect(() => {
  //   const handler = ({
  //     storageArea,
  //     key: k,
  //     oldValue,
  //     newValue,
  //   }: StorageEvent) => {
  //     if (!k) {
  //       return;
  //     }
  //     const isValidKey = isKey(k);
  //     const isLocalStorage = storageArea === localStorage;
  //     const isRightKey = k === makeKey(key);
  //     if (!(isLocalStorage && isValidKey && isRightKey)) {
  //       return;
  //     }
  //     try {
  //       const [ov, nv] = [oldValue!, newValue!];
  //       logGroup(
  //         '⚙ LocalStorageObject Event',
  //         key,
  //         [`Old Value: %c${ov}`, 'color: red; text-decoration: underline'],
  //         [`New Value: %c${nv}`, 'color: green; text-decoration: underline'],
  //       );
  //       setValue(nv);
  //     } catch (e) {
  //       logState('❌ Could not parse LS data from Event', key, newValue);
  //     }
  //   };
  //   window.addEventListener('storage', handler);
  //   return () => window.removeEventListener('storage', handler);
  // }, [setValue, key]);
  return [value, setValue];
};

export default useLocalStorageObject;
