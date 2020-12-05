import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { Container, withTheme } from '@material-ui/core';
import styled from 'styled-components';

import { NavBar } from './components/NavBar';
import { Drawer, RouteChangeDrawerClose } from './components/Drawer';
import CreateRecipe from './components/CreateRecipe';

import { HomeScreen } from './screens/Home';
import { RecipeScreen } from './screens/Recipe';
import { TestScreen } from './screens/Test';

const StyledContainer = withTheme(
  styled(Container)`
    background: ${({ theme: { palette: { background: { default: background } } } }) => background};
    width: 100vw;
    height: 100vh;
    max-width: initial;
    overflow-y: auto;
  `,
);

export const App: FC = () => (
  <Router>
    <NavBar />
    <Drawer />
    <RouteChangeDrawerClose />
    <StyledContainer>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/recipes/:name" component={RecipeScreen} />
        <Route exact path="/test" component={TestScreen} />
      </Switch>
    </StyledContainer>
    <CreateRecipe />
  </Router>
);

export default App;
