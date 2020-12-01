import React, { FC, useEffect } from 'react';
import {
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Container,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';

import { useHistory } from 'react-router';
import { useDrawer } from '../state/drawer';
import { RecipesList } from './RecipesList';
import Symbols from './SymbolsList';

const StyledDrawer = styled(SwipeableDrawer)`
  .styledPaper {
    min-width: min(100vw, 300px);
    max-width: 500px;
  }
  .styledRoot {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
  }
`;

const StyledAppBar = styled(AppBar)`
  position: sticky;
`;

const StyledContainer = styled(Container)`
  margin: 1.5rem 0;
`;

const DrawerAppBar: FC = ({ children }) => (
  <StyledAppBar>
    <Toolbar>
      <Container>
        <Typography variant="h4">{children}</Typography>
      </Container>
    </Toolbar>
  </StyledAppBar>
);

export const Drawer: FC = () => {
  const { isOpen, open, close } = useDrawer();
  return (
    <StyledDrawer
      disableSwipeToOpen={false}
      open={isOpen}
      onOpen={open}
      onClose={close}
      classes={{ paper: 'styledPaper', root: 'styledRoot' }}
    >
      <DrawerAppBar>Symbols</DrawerAppBar>
      <StyledContainer>
        <Symbols />
      </StyledContainer>
      <DrawerAppBar>Recipes</DrawerAppBar>
      <StyledContainer>
        <RecipesList />
      </StyledContainer>
    </StyledDrawer>
  );
};

export const RouteChangeDrawerClose: FC = () => {
  const history = useHistory();
  const { close } = useDrawer();
  useEffect(
    () => history.listen(() => {
      close();
    }),
    [history, close],
  );
  return <></>;
};
