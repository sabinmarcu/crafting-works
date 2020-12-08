import {
  createContext,
  FC,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import seedData from '../config/seed';
import {
  generateAST, generateSteps, generateUses, reduce,
} from '../utils/calculate';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';
import { RecipeContextType, RecipesContextType, RecipesType } from '../utils/types';
import { labelPrefix } from '../hooks/useLabel';
import { makeKey, stripKey } from '../hooks/config';

const RecipesContext = createContext<RecipesContextType>({
  recipes: {},
  symbols: [],
  names: [],
  labels: [],
  update: () => {},
  import: () => {},
  addRecipe: () => {},
  removeRecipe: () => {},
  reset: () => {},
});

export const useRecipes = () => useContext(RecipesContext);
export const RecipeProviderV3: FC = ({ children }) => {
  const [recipes, setRecipes, update] = useLocalStorageObject('recipes-v3', seedData);
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
  const labels = useMemo(
    () => (recipes
      ? Object.values(recipes as RecipesType)
        .map(({ labels: l }) => l)
        .filter(Boolean)
        .filter((it) => it!.length > 0)
        .reduce(
          (prev: string[], it) => ([
            ...prev,
            ...it!,
          ]),
          [],
        )
      : [])
      .sort()
      .filter((it, idx, arr) => arr.indexOf(it) === idx),
    [recipes],
  );
  useEffect(
    () => {
      if (labels.length === 0) {
        return undefined;
      }
      const match = makeKey(labelPrefix);
      const labelKeys = Object.keys(localStorage)
        .filter((it) => it.startsWith(match))
        .map((it) => stripKey(it, labelPrefix));
      const toRemove = labelKeys
        .filter((it) => !labels.includes(it))
        .map((it) => makeKey(it, `${labelPrefix}:`));
      toRemove.forEach((it) => localStorage.removeItem(it));
      return undefined;
    },
    [labels],
  );
  const symbols = useMemo(
    () => allSymbols
      .map((it) => ({ name: it, composite: recipeNames.includes(it) })),
    [allSymbols, recipeNames],
  );
  const addRecipe = useCallback(
    (name: string) => update(name, { input: {}, output: 1 }),
    [update],
  );
  const removeRecipe = useCallback(
    (name: string) => setRecipes(
      Object.entries(recipes)
        .filter(([key]) => key !== name)
        .reduce((prev, [key, value]) => ({
          ...prev,
          [key]: value,
        }), {}),
    ),
    [update],
  );
  const importFunc = useCallback(
    (imports: RecipesType) => {
      setRecipes({
        ...recipes,
        ...imports,
      });
    },
    [recipes, setRecipes],
  );
  const reset = useCallback(
    () => setRecipes({}),
    [setRecipes],
  );
  return (
    <RecipesContext.Provider value={{
      recipes,
      symbols,
      labels,
      names: recipeNames,
      update,
      reset,
      import: importFunc,
      addRecipe,
      removeRecipe,
    }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useSymbols = () => useRecipes().symbols;
export const useNames = () => useRecipes().names;

export const RecipeContext = createContext<RecipeContextType>({
  recipe: {
    input: {},
    output: -1,
  },
  resources: {},
  symbols: [],
  name: 'unknown',
  update: () => {},
  addInput: () => {},
  removeInput: () => {},
  addLabel: () => {},
  removeLabel: () => {},
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
  const addLabel = useCallback(
    (n: string) => {
      updateFunc('labels', [
        ...(recipe?.labels ?? []),
        n,
      ]);
    },
    [updateFunc, recipe],
  );
  const removeLabel = useCallback(
    (n: string) => {
      updateFunc('labels', (recipe?.labels ?? [])
        .filter((it) => it !== n));
    },
    [updateFunc, recipe],
  );
  const resources = useMemo(
    () => (recipe && store.recipes ? reduce(recipe, store.recipes) : {}),
    [recipe, store],
  );
  const ast = useMemo(
    () => (recipe && store.recipes
      ? generateAST(recipe, store.recipes, undefined, name)
      : undefined),
    [recipe, store, name],
  );
  const uses = useMemo(
    () => (store.recipes
      ? generateUses(name, store.recipes, undefined)
      : undefined),
    [store, name],
  );
  const steps = useMemo(
    () => (ast
      ? generateSteps(ast, resources)
      : undefined),
    [ast, resources],
  );
  return (
    <RecipeContext.Provider value={{
      recipe,
      symbols,
      name,
      resources,
      ast,
      uses,
      steps,
      update: updateFunc,
      addInput,
      removeInput,
      addLabel,
      removeLabel,
    }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
export const useResources = () => useContext(RecipeContext).resources;
export const useAST = () => useContext(RecipeContext).ast;
export const useUses = () => useContext(RecipeContext).uses;
export const useSteps = () => useContext(RecipeContext).steps;
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
    (val: string) => {
      const v = parseInt(val, 10);
      if (v > 0) {
        update('output', v);
      }
    },
    [update],
  );
  return [
    value,
    updateFunc,
  ];
};
