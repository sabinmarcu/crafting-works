import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useRecipe } from "../state/recipes";
import { Title } from "../state/title";
import { camelCaseToCapitalized } from "../utils/strings";

export const RecipeScreen: FC<RouteComponentProps<{ name: string }>> = ({
  match: {
    params: { name }
  }
}) => {
  const recipe = useRecipe(name);
  return (
    <>
      <Title title={`Recipe: ${camelCaseToCapitalized(name)}`} />
      <code style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(recipe, undefined, 2)}
      </code>
    </>
  );
};
