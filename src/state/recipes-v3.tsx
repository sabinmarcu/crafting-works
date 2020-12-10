import {
  createContext,
  FC,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import seedData from '../config/seed';
import {
  generateAST,
  generateSteps,
  generateUses,
  inheritLabels,
  reduce,
} from '../utils/calculate';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';
import {
  ComboRecipesType, ComboRecipeType, RecipeContextType, RecipesContextType, RecipesType,
} from '../utils/types';

const RecipesContext = createContext<RecipesContextType>({
  recipes: undefined,
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
  const [baseRecipes, setRecipes, update] = useLocalStorageObject<RecipesType>('recipes-v3', seedData);
  const recipes = useMemo(
    () => {
      if (!baseRecipes) {
        return undefined;
      }
      const recipesList = Object.entries(baseRecipes as RecipesType);
      const fixedRecipesList = recipesList
        .map(([key, value]): [string, ComboRecipeType] => {
          const deps = generateAST(value, baseRecipes, undefined, key);
          const uses = generateUses(key, baseRecipes, undefined);
          return [
            key,
            {
              ...value,
              deps,
              uses,
            },
          ];
        });
      const fixedRecipes = fixedRecipesList.reduce(
        (prev: ComboRecipesType, [key, value]) => ({
          ...prev,
          [key]: value,
        }),
        {} as ComboRecipesType,
      );
      Object.values(fixedRecipes)
        .forEach(({ deps }) => inheritLabels(deps, fixedRecipes));
      return fixedRecipes;
    },
    [baseRecipes],
  );
  const recipeNames = useMemo(
    () => (baseRecipes ? Object.keys(baseRecipes) : []),
    [baseRecipes],
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
    (name: string) => recipes && setRecipes(
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
  recipe: undefined,
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
      updateFunc('input', Object.entries(recipe?.input ?? {})
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
  const steps = useMemo(
    () => (recipe?.deps
      ? generateSteps(recipe.deps, resources)
      : undefined),
    [recipe, resources],
  );
  return (
    <RecipeContext.Provider value={{
      recipe,
      symbols,
      name,
      resources,
      ast: recipe?.deps,
      uses: recipe?.uses,
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
export const useInput = (name: string): [number | undefined, (val: string) => void] => {
  const { recipe, update } = useRecipe();
  const value = useMemo(
    () => recipe?.input[name],
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
export const useOutput = (): [number | undefined, (val: string) => void] => {
  const { recipe, update } = useRecipe();
  const value = useMemo(
    () => recipe?.output,
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
