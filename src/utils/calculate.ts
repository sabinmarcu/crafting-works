import { RecipeAST, RecipesType, RecipeType } from './types';

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
  name: string = 'root',
): RecipeAST => ({
  name,
  children: Object.keys(what.input)
    .map((it) => (recipes[it]
      ? generateAST(recipes[it], recipes, it)
      : { name: it })),
});
