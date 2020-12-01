import React from "react";
import { RecipesContext } from "../state/recipes";
import { Title } from "../state/title";

export const HomeScreen = () => (
  <>
    <Title title={"Home"} isRoot />
    <RecipesContext.Consumer>
      {(data) => (
        <code style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, undefined, 2)}
        </code>
      )}
    </RecipesContext.Consumer>
  </>
);
export default HomeScreen;
