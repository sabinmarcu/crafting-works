import React, {
  FC,
} from 'react';
import {
  Toolbar,
  Typography,
} from '@material-ui/core';
import { RecipesList } from '../RecipesList';
import Symbols from '../SymbolsList';
import {
  StickyAppBar,
  StyledToolbarContainer,
  StyledContainer,
} from '../styled';

const DrawerAppBar: FC = ({ children }) => (
  <StickyAppBar>
    <Toolbar>
      <StyledToolbarContainer>
        <Typography variant="h5">{children}</Typography>
      </StyledToolbarContainer>
    </Toolbar>
  </StickyAppBar>
);

export const RecipesView: FC = () => (
  <>
    <DrawerAppBar>Symbols</DrawerAppBar>
    <StyledContainer>
      <Symbols />
    </StyledContainer>
    <DrawerAppBar>Recipes</DrawerAppBar>
    <StyledContainer>
      <RecipesList />
    </StyledContainer>
  </>
);
