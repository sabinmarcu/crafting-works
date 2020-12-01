import React, {
  useMemo,
  useCallback,
  createContext,
  useContext,
  FC,
} from 'react';
import seedData from '../config/seed';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type RecipeInputType = Record<string, number>;
export type RecipeType = {
  input: RecipeInputType;
  output: number;
};
export type RecipesMapType = Record<string, RecipeType>;
export type RecipesUpdateType = (name: string, recipe: RecipeType) => void;
export type RecipesRemoveType = (name: string) => void;
export type SymbolType = {
  name: string;
  composite: boolean;
};
export type RecipesContextType = {
  recipes: RecipesMapType | undefined;
  symbols: SymbolType[];
  update: RecipesUpdateType;
  remove: RecipesRemoveType;
};

export const makeRecipe = (input: RecipeInputType, output: number) => ({
  input,
  output,
});

export const RecipesContext = createContext<RecipesContextType>({
  recipes: {},
  symbols: [],
  update: () => {},
  remove: () => {},
});
export const useRecipes = () => useContext(RecipesContext);
export const RecipesProvider: FC = ({ children }) => {
  const [recipes, setRecipes] = useLocalStorage<RecipesMapType>(
    'recipes',
    seedData,
  );
  const symbols = useMemo<SymbolType[]>(
    () => (recipes
      ? [
        ...Object.keys(recipes),
        ...Object.values(recipes)
          .map(({ input }) => Object.keys(input))
          .reduce((prev, it) => [...prev, ...it], []),
      ]
        .sort()
        .filter((it, idx, arr) => arr.indexOf(it) === idx)
        .map((it) => ({
          name: it,
          composite: it in recipes,
        }))
      : []),
    [recipes],
  );
  const updateRecipe = useCallback(
    (name: string, recipe: RecipeType) => {
      setRecipes((r) => ({
        ...r,
        [name]: recipe,
      }));
    },
    [setRecipes],
  );
  const removeRecipe = useCallback(
    (name: string) => {
      setRecipes(
        (r) => r
          && Object.entries(r)
            .filter(([k]) => k !== name)
            .reduce(
              (prev, [k, v]) => ({
                ...prev,
                [k]: v,
              }),
              {},
            ),
      );
    },
    [setRecipes],
  );
  return (
    <RecipesContext.Provider
      value={{
        recipes,
        symbols,
        update: updateRecipe,
        remove: removeRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};
export const useSymbols = () => useRecipes().symbols;
export const useRecipe = (name: string) => {
  const { recipes } = useRecipes();
  const recipe = useMemo(() => recipes?.[name] ?? {}, [recipes, name]);
  return {
    recipe,
  };
};
