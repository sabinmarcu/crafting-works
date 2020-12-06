import React, { FC, useEffect } from 'react';
import {
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Container,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

import { useHistory } from 'react-router';
import { useDrawer } from '../state/drawer';
import { RecipesList } from './RecipesList';
import Symbols from './SymbolsList';
import { useIsMobile } from '../hooks/useIsMobile';

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
  position: sticky !important;
`;

const StyledContainer = styled(Container)`
  margin: 1.5rem 0 !important;
`;

const StyledToolbarContainer = styled(Container)`
  display: flex !important;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const DrawerAppBar: FC = ({ children }) => {
  const isMobile = useIsMobile();
  const { close } = useDrawer();
  return (
    <StyledAppBar>
      <Toolbar>
        <StyledToolbarContainer>
          <Typography variant="h4">{children}</Typography>
          {isMobile && (
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          )}
        </StyledToolbarContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export const Drawer: FC = () => {
  const { isOpen, open, close } = useDrawer();
  return (
    <StyledDrawer
      open={isOpen}
      onOpen={open}
      onClose={close}
      anchor="right"
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
