import {
  createContext,
  FC,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import seedData from '../config/seed';
import {
  generateAST, generateSteps, generateUses, reduce,
} from '../utils/calculate';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';
import { RecipeContextType, RecipesContextType, RecipesType } from '../utils/types';
import { useLabelGuard } from '../hooks/useLabel';

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
  const [recipes, setRecipes, update] = useLocalStorageObject<RecipesType>('recipes-v3', seedData);
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
  useLabelGuard(labels);
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
  const ready = useMemo(
    () => [
      recipes,
      symbols,
      labels,
      recipeNames,
    ].filter((prev, it) => prev && it, true),
    [
      recipes,
      symbols,
      labels,
      recipeNames,
    ],
  );
  return ready
    ? (
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
    )
    : (
      <></>
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
