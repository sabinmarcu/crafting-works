import {
  RecipeAST,
  RecipeStepItem,
  RecipeStep,
  RecipeSteps,
  RecipesType,
  RecipeType,
  SymbolType,
} from './types';

export const adjust = (
  obj: Record<string, number>,
  amount: number,
): Record<string, number> => Object.entries(obj).reduce(
  (prev, [k, v]) => ({
    ...prev,
    [k]: v * amount,
  }),
  {},
);

export const reduce = (
  what: RecipeType,
  recipes: RecipesType,
): Record<string, number> => {
  const input = Object.entries(what.input).map(([key, value]) => (key in recipes
    ? {
      ...adjust(
        reduce(recipes[key], recipes),
        Math.ceil(value / recipes[key].output),
      ),
      [`_${key}`]: value,
    }
    : { [key]: value }));
  const combined = input.reduce(
    (prev, obj) => Object.entries(obj).reduce(
      (p, [k, v]) => ({
        ...p,
        [k]: ((p[k] || 0) + v),
      }),
      prev,
    ),
    {},
  );
  return combined;
};

export const generateAST = (
  what: RecipeType,
  recipes: RecipesType,
  parent?: RecipeAST,
  name: string = 'root',
): RecipeAST => {
  const ast: RecipeAST = {
    name,
    parent,
  };
  ast.children = Object.keys(what.input)
    .map((it) => (recipes[it]
      ? generateAST(recipes[it], recipes, ast, it)
      : { name: it, parent: ast }));
  return ast;
};

export const generateSteps = (
  ast: RecipeAST,
  resources: Record<string, number>,
): RecipeSteps => {
  let toWalk = [ast];
  const steps: RecipeSteps = [];
  while (toWalk.length > 0) {
    const step: RecipeStep = [];
    toWalk
      .filter(({ name }) => resources[`_${name}`])
      .forEach(({ name }) => {
        step.push({
          name,
          amount: resources[`_${name}`] || 0,
        });
      });
    if (step.length > 0) {
      steps.push(
        step
          .filter((
            it: RecipeStepItem,
            idx: number,
            arr: RecipeStep,
          ) => arr.findIndex(({ name }) => name === it.name) === idx),
      );
    }
    toWalk = toWalk
      .filter(({ children }) => children)
      .reduce(
        (prev, { children }) => [...prev, ...children!],
        [] as RecipeAST[],
      );
  }
  return steps.reverse();
};

export const hasCircularDependency = (
  symbol: SymbolType,
  recipe: RecipeType,
  recipes: RecipesType,
  symbols: SymbolType[],
): boolean => {
  console.log('circular', symbol, recipe);
  const ownSymbols = Object.keys(recipe.input);
  console.log(ownSymbols);
  const containsSymbol = ownSymbols
    .reduce((prev, it) => prev || (it === symbol.name), false);
  console.log(containsSymbol);
  if (containsSymbol) {
    return true;
  }
  const nextRecipes = (ownSymbols
    .map((it) => symbols.find(({ name }) => name === it))
    .filter(Boolean) as SymbolType[]
  )
    .filter(({ composite }) => composite)
    .map(({ name }) => recipes[name])
    .filter(Boolean);
  console.log((ownSymbols
    .map((it) => symbols.find(({ name }) => name === it))
    .filter(Boolean) as SymbolType[]
  ));
  const nextContainSymbol = nextRecipes.reduce(
    (prev, it) => prev || hasCircularDependency(
      symbol,
      it,
      recipes,
      symbols,
    ),
    false,
  );
  return nextContainSymbol;
};
