import React, {
  useMemo,
  useCallback,
  createContext,
  useContext,
  FC,
  useState,
  useEffect,
} from 'react';
import seedData from '../config/seed';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePrevious } from '../hooks/usePrevious';

export type RecipeInputType = Record<string, number>;
export type RecipeSeedType = {
  input: RecipeInputType;
  output: number;
};
export type RecipeType = RecipeSeedType & {
  name: string,
};
export type RecipesSeedMapType = Record<string, RecipeSeedType>;
export type RecipesMapType = Record<string, RecipeType>;
export type RecipesUpdateType = (name: string, recipe: RecipeType) => void;
export type RecipesRemoveType = (name: string) => void;
export type SymbolType = {
  name: string;
  composite?: boolean;
};
export type RecipesContextType = {
  recipes: RecipesMapType | undefined;
  symbols: SymbolType[];
  update: RecipesUpdateType;
  remove: RecipesRemoveType;
};

type RecipeInputEditType = { symbol: string, amount: number };

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

export const processSeedData = (data: RecipesSeedMapType): {
  symbols: string[],
  recipes: RecipesMapType
} => {
  const symbols: string[] = Object.keys(data);
  const recipes: RecipesMapType = Object.entries(data)
    .reduce((prev, [key, value]) => ({
      ...prev,
      [key]: {
        ...value,
        name: key,
      },
    }), {});
  return {
    symbols,
    recipes,
  };
};
export const RecipesProvider: FC = ({ children }) => {
  const [recipes, setRecipes] = useLocalStorage<RecipesMapType>(
    'recipes', processSeedData(seedData).recipes,
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
  const { recipes, update } = useRecipes();
  const recipe = useMemo(
    () => {
      console.log('recipe', name, recipes?.[name]);
      return recipes?.[name] ?? undefined;
    },
    [recipes, name],
  );
  const [inputs, setInputs] = useState<RecipeInputEditType[]>([]);
  const [output, setOutput] = useState<number>(0);
  const prevName = usePrevious(name);
  useEffect(
    () => {
      if (recipe && (inputs.length === 0 || prevName !== name)) {
        setOutput(recipe.output);
        setInputs(Object.entries(recipe.input)
          .map(([key, value]) => ({
            symbol: key,
            amount: value,
          })));
      }
    },
    [name, prevName, recipe, inputs, setOutput, setInputs],
  );
  useEffect(
    () => {
      if (!(recipe && recipe.name === name)) {
        return undefined;
      }
      update(name, {
        name,
        input: inputs.reduce((prev, { symbol, amount }) => ({
          ...prev,
          [symbol]: amount,
        }), {}),
        output,
      });
      return undefined;
    },
    [name, recipe?.name, prevName, inputs, output, update],
  );
  const updateInput = useCallback(
    (
      inputName: string,
      inputValue: number,
    ) => setInputs((i) => i.map(
      ({ symbol, amount }) => (symbol === inputName
        ? ({ symbol, amount: inputValue })
        : ({ symbol, amount })),
    )),
    [setInputs],
  );
  const deleteInput = useCallback(
    (input: string) => setInputs(
      (i) => i.filter(({ symbol }) => symbol !== input),
    ),
    [setInputs],
  );
  const addInput = useCallback(
    (input: string) => setInputs(
      (i) => [...i, { symbol: input, amount: 0 }],
    ),
    [setInputs],
  );
  return {
    recipe,
    inputs,
    output,
    updateInput,
    deleteInput,
    addInput,
  };
};
