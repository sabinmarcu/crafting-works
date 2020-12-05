import { makeList } from './list';
import seedData from '../config/seed';

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

export type RecipeInputEditType = { symbol: string, amount: number };

const {
  Provider,
  useExtra,
  useContext,
  useList,
  useValues,
  useControls,
  useKey,
  useItem,
  List,
} = makeList<RecipeType, RecipesExtraType>(
  'recipes-v2',
  seedData,
  (input: RecipesType): RecipesExtraType => {
    const allSymbols = Object.keys(input);
    const symbols = [
      ...allSymbols,
      ...Object.values(input)
        .map(({ input: inpt }) => Object.keys(inpt))
        .reduce((prev, it) => [...prev, ...it], []),
    ]
      .sort()
      .filter((it, idx, arr) => arr.indexOf(it) === idx)
      .map((name) => ({
        name,
        composite: allSymbols.includes(name),
      }));
    return {
      recipes: input,
      symbols,
    };
  },
);

const useSymbols = () => useExtra()?.symbols;
const useRecipes = () => useExtra()?.recipes;

export {
  Provider,
  useSymbols,
  useRecipes,
  useContext,
  useList,
  useValues,
  useControls,
  useKey,
  useItem,
  List,
};
