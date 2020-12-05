import {
  createContext,
  FC,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import seedData from '../config/seed';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';

export type RecipeInputType = Record<string, number>;
export type RecipeType = {
  input: RecipeInputType;
  output: number;
};
export type RecipesType = Record<string, RecipeType>;
export type SymbolType = {
  name: string;
  composite?: boolean;
};
export type RecipesExtraType = {
  recipes: RecipesType | undefined;
  symbols: SymbolType[];
};

type RecipesValuesType = {
  recipes: RecipesType,
  symbols: SymbolType[],
  names: string[],
};

type RecipesFuncsType = {
  update: (path: string, value: any) => void;
};

type RecipesContextType = RecipesValuesType & RecipesFuncsType;

const RecipesContext = createContext<RecipesContextType>({
  recipes: {},
  symbols: [],
  names: [],
  update: () => {},
});

export const useRecipes = () => useContext(RecipesContext);

export const RecipeProviderV3: FC = ({ children }) => {
  const [recipes,,update] = useLocalStorageObject('recipes-v3', seedData);
  const recipeNames = useMemo(
    () => (recipes ? Object.keys(recipes) : []),
    [recipes],
  );
  const allSymbols = useMemo(
    () => (recipes
      ? [
        ...recipeNames,
        ...Object.values(recipes as RecipesType)
          .reduce((prev, it) => [
            ...prev,
            ...Object.keys(it.input),
          ],
          [] as string[]),
      ]
        .sort()
        .filter((it, idx, arr) => arr.indexOf(it) === idx)
      : []),
    [recipes, recipeNames],
  );
  const symbols = useMemo(
    () => allSymbols
      .map((it) => ({ name: it, composite: recipeNames.includes(it) })),
    [allSymbols, recipeNames],
  );
  return (
    <RecipesContext.Provider value={{
      recipes,
      symbols,
      names: recipeNames,
      update,
    }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useSymbols = () => useRecipes().symbols;
export const useNames = () => useRecipes().names;

type RecipeContextType = {
  recipe: RecipeType,
  symbols: SymbolType[],
  name: string,
  update: (path: string, value: any) => void,
  addInput: (name: string) => void,
  removeInput: (name: string) => void,
};
export const RecipeContext = createContext<RecipeContextType>({
  recipe: {
    input: {},
    output: -1,
  },
  symbols: [],
  name: 'unknown',
  update: () => {},
  addInput: () => {},
  removeInput: () => {},
});

export const RecipeProvider: FC<{ name: string }> = ({ children, name }) => {
  const store = useRecipes();
  const recipe = useMemo(
    () => store.recipes?.[name] || undefined,
    [store, name],
  );
  const symbols = useMemo(
    () => (recipe ? Object.keys(recipe.input) : [])
      .map((it) => ({ name: it, composite: store.names.includes(it) })),
    [recipe],
  );
  const updateFunc = useCallback(
    (path: string, value: any) => {
      store.update([name, path].join('.'), value);
    },
    [store, name],
  );
  const addInput = useCallback(
    (n: string) => {
      updateFunc(['input', n].join('.'), 0);
    },
    [updateFunc, recipe],
  );
  const removeInput = useCallback(
    (n: string) => {
      updateFunc('input', Object.entries(recipe.input || {})
        .filter(([key]) => key !== n)
        .reduce((prev, [k, v]) => ({
          ...prev,
          [k]: v,
        }), {}));
    },
    [updateFunc, recipe],
  );
  return (
    <RecipeContext.Provider value={{
      recipe,
      symbols,
      name,
      update: updateFunc,
      addInput,
      removeInput,
    }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
export const useInput = (name: string): [number, (val: string) => void] => {
  const { recipe, update } = useRecipe();
  const value = useMemo(
    () => recipe.input[name],
    [recipe],
  );
  const updateFunc = useCallback(
    (val: string) => update(['input', name].join('.'), parseInt(val, 10)),
    [update],
  );
  return [
    value,
    updateFunc,
  ];
};
export const useOutput = (): [number, (val: string) => void] => {
  const { recipe, update } = useRecipe();
  const value = useMemo(
    () => recipe.output,
    [recipe],
  );
  const updateFunc = useCallback(
    (val: string) => update('output', parseInt(val, 10)),
    [update],
  );
  return [
    value,
    updateFunc,
  ];
};
