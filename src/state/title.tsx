import React, {
  FC,
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect
} from "react";

type TitleContextType = {
  title: string;
  isRoot: boolean;
  setTitle: (input: string, root?: boolean) => void;
};

export const TitleContext = createContext<TitleContextType>({
  title: "Unknown",
  isRoot: false,
  setTitle: () => {}
});
export const useTitle = () => useContext(TitleContext);

export const TitleProvider: FC = ({ children }) => {
  const [title, setTitle] = useState("Unknown");
  const [isRoot, setIsRoot] = useState(false);
  const update = useCallback(
    (input: string, isRoot?: boolean) => {
      setTitle(input);
      setIsRoot(!!isRoot);
    },
    [setTitle, setIsRoot]
  );
  return (
    <TitleContext.Provider
      value={{
        title,
        isRoot,
        setTitle: update
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};

export const Title: FC<{
  title: string;
  isRoot?: boolean;
}> = ({ title, isRoot }) => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle(title, isRoot), [setTitle, title, isRoot]);
  return <></>;
};
