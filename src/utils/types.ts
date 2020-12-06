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

export type RecipesValuesType = {
  recipes: RecipesType,
  symbols: SymbolType[],
  names: string[],
};

export type RecipesFuncsType = {
  update: (path: string, value: any) => void;
  addRecipe: (name: string) => void;
};

export type RecipesContextType = RecipesValuesType & RecipesFuncsType;

export type RecipeContextType = {
  recipe: RecipeType,
  symbols: SymbolType[],
  name: string,
  ast?: RecipeAST,
  resources: Record<string, number>,
  update: (path: string, value: any) => void,
  addInput: (name: string) => void,
  removeInput: (name: string) => void,
};

export type RecipeAST = {
  name: string,
  children?: RecipeAST[],
};
