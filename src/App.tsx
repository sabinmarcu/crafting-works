import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { Container, withTheme } from '@material-ui/core';
import styled from 'styled-components';

import { use100vh } from 'react-div-100vh';

import { baseURL } from './config/constants';
import { Redirect } from './components/Redirect';

import { NavBar } from './components/NavBar';
import { Drawer, RouteChangeDrawerClose } from './components/Drawer';
import CreateRecipe from './components/CreateRecipe';

import { HomeScreen } from './screens/Home';
import { RecipeScreen, baseRoute as recipeRoute } from './screens/Recipe';
import { TestScreen } from './screens/Test';
import { Error404Screen } from './screens/404';

const StyledContainerRaw = withTheme(
  styled(Container)`
    background: ${({ theme: { palette: { background: { default: background } } } }) => background};
    width: 100vw !important;
    max-width: initial !important;
  `,
);

const StyledContainer: FC = ({ children }) => {
  const height = use100vh();
  return (
    <StyledContainerRaw style={{ minHeight: height }}>
      {children}
    </StyledContainerRaw>
  );
};

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
        <Route path="/" component={Error404Screen} />
      </Switch>
      <CreateRecipe />
    </StyledContainer>
  </Router>
);
