import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { Container, withTheme } from '@material-ui/core';
import styled from 'styled-components';

import { Redirect } from './components/Redirect';
import { NavBar } from './components/NavBar';
import { Drawer, RouteChangeDrawerClose } from './components/Drawer';
import CreateRecipe from './components/CreateRecipe';

import { HomeScreen } from './screens/Home';
import { RecipeScreen, baseRoute as recipeRoute } from './screens/Recipe';
import { TestScreen } from './screens/Test';
import { baseURL } from './config/constants';

const StyledContainer = withTheme(
  styled(Container)`
    background: ${({ theme: { palette: { background: { default: background } } } }) => background};
    width: 100vw !important;
    min-height: 100vh;
    max-width: initial !important;
  `,
);

export const App: FC = () => (
  <Router basename={baseURL}>
    <Redirect />
    <RouteChangeDrawerClose />
    <StyledContainer>
      <NavBar />
      <Drawer />
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route path={recipeRoute} component={RecipeScreen} />
        <Route exact path="/test" component={TestScreen} />
      </Switch>
      <CreateRecipe />
    </StyledContainer>
  </Router>
);

export default App;
