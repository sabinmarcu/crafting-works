import React, {
  FC, useCallback, useEffect,
} from 'react';
import {
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Tab,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

import { useHistory } from 'react-router';
import { TabContext, TabPanel } from '@material-ui/lab';
import { useDrawer } from '../state/drawer';
import { RecipesList } from './RecipesList';
import Symbols from './SymbolsList';
import { onMobile, StyledTabs } from './styled';
import { useIsMobile } from '../hooks/useIsMobile';
import { BottomFab } from './BottomFab';
import { useLocalStorage } from '../hooks/useLocalStorage';

const drawerStyle = `
  min-width: min(100vw, 300px);
  max-width: 500px;
  ${onMobile} {
    min-width: 100vw;
    max-width: 100vw;
  }
`;
const StyledDrawer = styled(SwipeableDrawer)`
  .styledPaper {
    ${drawerStyle}
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

const StyledTabPanel = styled(TabPanel)`
  padding: 0 !important;
  ${drawerStyle}
`;

const DrawerAppBar: FC = ({ children }) => (
  <StyledAppBar>
    <Toolbar>
      <StyledToolbarContainer>
        <Typography variant="h4">{children}</Typography>
      </StyledToolbarContainer>
    </Toolbar>
  </StyledAppBar>
);

export const DrawerWrapper = styled.section`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
`;

export const DrawerInner = styled.article`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
`;

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

export const SettingsView: FC = () => {
  const reset = useCallback(
    () => {
      Object.keys(localStorage)
        .forEach((key) => localStorage.removeItem(key));

      // @ts-ignore
      window.location = `${window.location}`;
    },
    [],
  );
  return (
    <StyledContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={reset}
      >
        Reset
      </Button>
    </StyledContainer>
  );
};

const tabs = [
  { title: 'Recipes', Component: RecipesView },
  { title: 'Settings', Component: SettingsView },
];

export const Drawer: FC = () => {
  const isMobile = useIsMobile();
  const { isOpen, open, close } = useDrawer();
  const [tab, setTab] = useLocalStorage<string>('drawer-tab', tabs[0].title);
  const onChange = useCallback(
    (event, newValue) => setTab(newValue),
    [setTab],
  );
  return (
    <StyledDrawer
      open={isOpen}
      onOpen={open}
      onClose={close}
      anchor="right"
      classes={{ paper: 'styledPaper', root: 'styledRoot' }}
    >
      <DrawerWrapper>
        <TabContext value={tab || tabs[0].title}>
          <StyledTabs
            value={tab}
            onChange={onChange}
          >
            {tabs.map(({ title }) => (
              <Tab label={title} key={title} value={title} />
            ))}
          </StyledTabs>
          <DrawerInner>
            {tabs.map(({ title, Component }) => (
              <StyledTabPanel value={title} key={title}>
                <Component />
              </StyledTabPanel>
            ))}
            {isMobile && (
              <BottomFab
                onClick={close}
                Icon={CloseIcon}
                horizontal="left"
              />
            )}
          </DrawerInner>
        </TabContext>
      </DrawerWrapper>
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
