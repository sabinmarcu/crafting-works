import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import {
  logState,
  makeKey,
  isKey,
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
      [key]: /^[0-9]+$/.test(value) ? parseInt(value, 10) : value,
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
  remove,
  set,
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
    .filter((it) => orig[it] !== target[it])
    .reduce((prev, it) => [
      ...prev,
      ...(typeof target[it] === 'object'
        ? [
          {
            key: [prefix, it].join(':'),
            value: (Array.isArray(target[it])
              ? makeType('array')
              : makeType('object')),
            action: DiffActions.set,
          },
          ...makePairs(target[it], [prefix, it].join(':'))
            .map((i) => ({ ...i, action: DiffActions.set })),
        ]
        : [{
          key: [prefix, it].join(':'),
          value: target[it],
          action: DiffActions.set,
        }]),
    ], [] as DiffPair[]) as DiffPair[];
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

const updateObject = (obj: any, path: string, value: any): any => {
  if (path.length === 0) {
    return /^[0-9]+$/.test(value) ? parseInt(value, 10) : value;
  }
  let split = path.indexOf('.');
  if (split === -1) {
    split = path.length;
  }
  const [key, rest] = [path.substr(0, split), path.substr(split + 1)];
  return {
    ...obj,
    [key]: updateObject(obj[key] || {}, rest, value),
  };
};

enum SetTypes {
  initial,
  update,
  network,
}

type ValueType = {
  action: SetTypes,
  value: any,
};

export const useLocalStorageObject = (
  key: string,
  defaultValue?: any,
): [
    any,
    Dispatch<SetStateAction<any>>,
    (path: string, value: any
    ) => void,
  ] => {
  const prevKey = usePrevious(key);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [state, setValue] = useState<ValueType>();
  useEffect(() => {
    if (!initialLoad || prevKey !== key) {
      setInitialLoad(true);
      const realKey = makeKey(key);
      const val = localStorage.getItem(realKey);
      if (val) {
        setValue({ value: readPairs(realKey), action: SetTypes.initial });
      } else {
        setValue({ value: defaultValue, action: SetTypes.initial });
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
      if (state?.action !== SetTypes.update) {
        return;
      }
      const realKey = makeKey(key);
      const diffs = diff(readPairs(realKey), input, realKey);
      if (diffs) {
        logState('⚙ LocalStorageObject Set', realKey, state?.value);
        diffs
          .forEach(({ key: k, value: v, action }) => (action === DiffActions.remove
            ? localStorage.removeItem(k)
            : localStorage.setItem(k, v)));
      }
    },
    [state, key],
  );
  const updateField = useCallback(
    (path: string, val: any) => {
      const diffObj = updateObject(state?.value, path, val);
      setValue({ value: diffObj, action: SetTypes.update });
    },
    [state, key, setValue],
  );
  useEffect(() => {
    if (!initialLoad) {
      return undefined;
    }
    if (!state?.value) {
      logState('⚙ LocalStorageObject Remove', key, state?.value);
      diffUpdate({});
      localStorage.removeItem(makeKey(key));
    }
    diffUpdate(state?.value);
    return undefined;
  }, [key, state, initialLoad, diffUpdate]);
  useEffect(() => {
    const handler = ({
      storageArea,
      key: k,
    }: StorageEvent) => {
      if (!k) {
        return;
      }
      const isValidKey = isKey(k);
      const isLocalStorage = storageArea === localStorage;
      if (!(isLocalStorage && isValidKey)) {
        return;
      }
      setValue({ value: readPairs(makeKey(key)), action: SetTypes.network });
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [setValue, key]);
  const update = useCallback(
    (input: any) => setValue({ value: input, action: SetTypes.update }),
    [setValue],
  );
  return [state?.value, update, updateField];
};

export default useLocalStorageObject;
