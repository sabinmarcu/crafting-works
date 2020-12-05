import {
  Context,
  createContext,
  useContext,
  createElement,
  FC,
  Fragment,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  useLocalStorageList,
  ExpandedValues,
  ListValues,
} from '../hooks/useLocalStorageList';
import {
  useLocalStorage,
} from '../hooks/useLocalStorage';
import { stripKey } from '../hooks/config';

export type ListContext<T, K> = {
  keys: string[],
  values: ExpandedValues<T> | undefined,
  extra: K | undefined,
} & {
  addItem: (key: string, force?: boolean) => void,
  removeItem: (key: string, force?: boolean) => void,
  updateItem: (key: string, value?: T, force?: boolean) => void,
  refresh: (logText?: string | undefined) => void,
  getKey: (key: string) => string,
};

export const makeContext = <T, K>() => createContext<ListContext<T, K>>({
  keys: [],
  values: {},
  extra: undefined,
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  refresh: () => {},
  getKey: () => '',
});

export const makeProvider = <T, K>({
  name,
  defaultValue,
  context,
  extra,
}: {
  name: string,
  defaultValue?: ExpandedValues<T>,
  context: Context<ListContext<T, K>>
  extra?: (input: ExpandedValues<T>) => K,
}) => {
  const Provider: FC = ({ children }) => {
    const { value, ...rest } = useLocalStorageList(
      `${name}:`, {
        expand: true,
        defaultValue,
      },
    );
    const keys: string[] = useMemo(
      () => (value ? Object.keys(value) : []),
      [value],
    );
    const extraValues: K | undefined = useMemo(
      () => (value && extra
        ? extra(value)
        : undefined),
      [value, extra],
    );
    // eslint-disable-next-line react/destructuring-assignment
    return createElement(context.Provider, {
      value: {
        ...rest,
        keys,
        values: value,
        extra: extraValues,
      },
    }, children);
  };
  return Provider;
};

export const makeUseContext = <T, K>({
  context,
}: {
  context: Context<ListContext<T, K>>
}) => () => useContext(context);

export const makeUseList = <T, K>({
  useContext: uC,
}: {
  useContext: () => ListContext<T, K>
}) => () => {
    const { keys } = uC();
    return keys;
  };

export const makeUseValues = <T, K>({
  useContext: uC,
}: {
  useContext: () => ListContext<T, K>
}) => () => {
    const { values } = uC();
    return values;
  };

export const makeUseExtra = <T, K>({
  useContext: uC,
}: {
  useContext: () => ListContext<T, K>
}) => () => {
    const { extra } = uC();
    return extra;
  };

export const makeUseControls = <T, K>({
  useContext: uC,
}: {
  useContext: () => ListContext<T, K>
}) => () => {
    const {
      addItem,
      updateItem,
      removeItem,
      refresh,
    } = uC();
    return {
      addItem,
      updateItem,
      removeItem,
      refresh,
    };
  };

export const makeUseKey = <T, K>({
  useContext: uC,
}: {
  useContext: () => ListContext<T, K>
}) => (key: string) => {
    const { getKey } = uC();
    return getKey(key);
  };

export const makeUseItem = <T, K>({
  useKey,
  useControls,
}: {
  useKey: (key: string) => string
  useControls: () => Omit<ListContext<T, K>, 'keys' | 'values' | 'getKey' | 'extra'>
}) => (key: string): [
    {value: T | undefined, key: string},
    {set: (input: T) => void, remove: () => void},
  ] => {
    const realKey = useKey(key);
    const fixedKey = useMemo(
      () => stripKey(realKey, ''),
      [realKey],
    );
    const { removeItem, refresh } = useControls();
    const [value, setValue] = useLocalStorage<T>(fixedKey);
    const remove = useCallback(
      () => removeItem(key),
      [removeItem, key],
    );
    useEffect(
      () => {
        refresh();
      },
      [refresh, value],
    );
    return [{ value, key }, { set: setValue, remove }];
  };

export const makeListComponent = <T>({
  useList,
}: {
  useList: () => ListValues<T> | undefined,
}): FC => ({ children }) => {
    const list = useList();
    if (typeof children === 'function' && list) {
      return children(list);
    }
    return createElement(Fragment);
  };

export const makeList = <T, K = {}>(
  name: string,
  defaultValue?: ExpandedValues<T>,
  extra?: (input: ExpandedValues<T>) => K,
) => {
  const context = makeContext<T, K>();
  const provider = makeProvider<T, K>({
    name, context, defaultValue, extra,
  });
  const useContextFunc = makeUseContext<T, K>({ context });
  const useList = makeUseList<T, K>({ useContext: useContextFunc });
  const useValues = makeUseValues<T, K>({ useContext: useContextFunc });
  const useExtra = makeUseExtra<T, K>({ useContext: useContextFunc });
  const useControls = makeUseControls<T, K>({ useContext: useContextFunc });
  const useKey = makeUseKey<T, K>({ useContext: useContextFunc });
  const useItem = makeUseItem<T, K>({ useKey, useControls });
  const List = makeListComponent<T>({ useList });

  return {
    Context: context,
    Provider: provider,
    useContext: useContextFunc,
    useList,
    useValues,
    useControls,
    useKey,
    useItem,
    useExtra,
    List,
  };
};
