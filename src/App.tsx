import React, { FC } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router";
import { Container } from "@material-ui/core";

import { NavBar } from "./components/NavBar";
import { Drawer, RouteChangeDrawerClose } from "./components/Drawer";

import { HomeScreen } from "./screens/Home";
import { RecipeScreen } from "./screens/Recipe";

export const App: FC = () => (
  <Router>
    <NavBar />
    <Drawer />
    <RouteChangeDrawerClose />
    <Container>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/recipes/:name" component={RecipeScreen} />
      </Switch>
    </Container>
  </Router>
);

export default App;
