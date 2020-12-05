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

export type ListContext<T> = {
  keys: string[],
  values: ExpandedValues<T> | undefined,
} & {
  addItem: (key: string, force?: boolean) => void,
  removeItem: (key: string, force?: boolean) => void,
  updateItem: (key: string, value?: T, force?: boolean) => void,
  refresh: (logText?: string | undefined) => void,
  getKey: (key: string) => string,
};

export const makeContext = <T>() => createContext<ListContext<T>>({
  keys: [],
  values: {},
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  refresh: () => {},
  getKey: () => '',
});

export const makeProvider = <T>({
  name,
  defaultValue,
  context,
}: {
  name: string,
  defaultValue?: ExpandedValues<T>,
  context: Context<ListContext<T>>
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
    // eslint-disable-next-line react/destructuring-assignment
    return createElement(context.Provider, {
      value: {
        ...rest,
        keys,
        values: value,
      },
    }, children);
  };
  return Provider;
};

export const makeUseContext = <T>({
  context,
}: {
  context: Context<ListContext<T>>
}) => () => useContext(context);

export const makeUseList = <T>({
  useContext: uC,
}: {
  useContext: () => ListContext<T>
}) => () => {
    const { keys } = uC();
    return keys;
  };

export const makeUseValues = <T>({
  useContext: uC,
}: {
  useContext: () => ListContext<T>
}) => () => {
    const { values } = uC();
    return values;
  };

export const makeUseControls = <T>({
  useContext: uC,
}: {
  useContext: () => ListContext<T>
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

export const makeUseKey = <T>({
  useContext: uC,
}: {
  useContext: () => ListContext<T>
}) => (key: string) => {
    const { getKey } = uC();
    return getKey(key);
  };

export const makeUseItem = <T>({
  useKey,
  useControls,
}: {
  useKey: (key: string) => string
  useControls: () => Omit<ListContext<T>, 'keys' | 'values' | 'getKey'>
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

export const makeList = <T>(
  name: string,
  defaultValue?: ExpandedValues<T>,
) => {
  const context = makeContext<T>();
  const provider = makeProvider<T>({ name, context, defaultValue });
  const useContextFunc = makeUseContext<T>({ context });
  const useList = makeUseList<T>({ useContext: useContextFunc });
  const useValues = makeUseValues<T>({ useContext: useContextFunc });
  const useControls = makeUseControls<T>({ useContext: useContextFunc });
  const useKey = makeUseKey<T>({ useContext: useContextFunc });
  const useItem = makeUseItem<T>({ useKey, useControls });
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
    List,
  };
};
