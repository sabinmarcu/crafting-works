import {
  createContext,
  useContext,
  useCallback,
  FC,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type StackContextType = {
  isEnabled: boolean | undefined,
  stackSize: number | undefined,
  toggleEnabled: () => void,
  setStackSize: (input: number) => void,
};

export const StackContext = createContext<StackContextType>({
  isEnabled: false,
  stackSize: 1,
  toggleEnabled: () => {},
  setStackSize: () => {},
});

export const StackProvider: FC = ({
  children,
}) => {
  const [isEnabled, setIsEnabled] = useLocalStorage<boolean>('stacks-enabled', false);
  const toggleEnabled = useCallback(
    () => setIsEnabled((t) => !t),
    [setIsEnabled],
  );
  const [stackSize, setStackSize] = useLocalStorage<number>('stacks-size', 1);
  const setter = useCallback(
    (input: number) => (input > 0 ? setStackSize(input) : undefined),
    [setStackSize],
  );
  return (
    <StackContext.Provider value={{
      isEnabled,
      toggleEnabled,
      stackSize,
      setStackSize: setter,
    }}
    >
      {children}
    </StackContext.Provider>
  );
};

export const useStacks = () => useContext(StackContext);
