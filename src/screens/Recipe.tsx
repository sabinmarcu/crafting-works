import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  Route,
  useHistory,
  useLocation,
  useParams, useRouteMatch,
} from 'react-router';
import {
  AppBar, Container, Tab, Tabs, withTheme,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  RecipeProvider,
} from '../state/recipes-v3';

import { useIsMobile } from '../hooks/useIsMobile';
import { RecipeEditor } from '../components/RecipeEditor';
import { RecipeViewer } from '../components/RecipeViewer';
import { toolbarStyles } from '../components/styled';
import { usePrevious } from '../hooks/usePrevious';

const StyledContainer = styled(Container)`
  padding: 1rem 0;
`;

const StyledTabs = withTheme(
  styled(Tabs)`
    .MuiTabs-flexContainer {
      ${toolbarStyles}
    }
  `,
);

export const baseRoute = '/recipes/:name';

const tabs = [
  { title: 'Viewer', Component: RecipeViewer, route: '/view' },
  { title: 'Editor', Component: RecipeEditor, route: '/edit' },
];

export const routes = tabs.map(({ route }) => route);

export const RecipeScreen: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const path = useRouteMatch({
    path: baseRoute,
  });
  useEffect(
    () => {
      if (path && path.isExact) {
        history.push(`${path.url}${tabs[0].route}`);
      }
    },
    [path, history, location],
  );
  const { name } = useParams<{name:string}>();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<number>(
    path
      ? tabs.findIndex(
        ({ route }) => route === location.pathname.replace(path.url, ''),
      )
        || 0
      : 0,
  );
  const prevTab = usePrevious(tab);
  useEffect(
    () => {
      if (path && prevTab !== tab) {
        history.push(`${path.url}${tabs[tab].route}`);
      }
    },
    [history, path, tab, prevTab],
  );
  const onChange = useCallback(
    (event, newValue) => setTab(newValue),
    [setTab],
  );
  return (
    <RecipeProvider name={name}>
      <StyledContainer>
        <AppBar position="static">
          <StyledTabs
            value={tab}
            onChange={onChange}
            variant={isMobile ? 'fullWidth' : undefined}
          >
            {tabs.map(({ title }) => <Tab label={title} key={title} />)}
          </StyledTabs>
        </AppBar>
        {tabs.map(({ title, route, Component }) => (
          <Route
            exact
            path={`${baseRoute}${route}`}
            component={Component}
            key={title}
          />
        ))}
      </StyledContainer>
    </RecipeProvider>
  );
};

export default RecipeScreen;
