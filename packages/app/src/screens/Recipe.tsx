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
  AppBar, Container, Tab,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  RecipeProvider, useRecipe,
} from '../state/recipes-v3';

import { useIsMobile } from '../hooks/useMedia';
import { RecipeEditor } from '../components/RecipeEditor';
import { RecipeViewer } from '../components/RecipeViewer';
import { StyledTabs } from '../components/styled';
import { usePrevious } from '../hooks/usePrevious';
import { recipeBaseRoute } from '../config/constants';

const StyledContainer = styled(Container)`
  padding: 1rem 0;
`;

export const baseRoute = recipeBaseRoute;

const tabs = [
  { title: 'Viewer', Component: RecipeViewer, route: '/view' },
  { title: 'Editor', Component: RecipeEditor, route: '/edit' },
];

export const routes = tabs.map(({ route }) => route);

export const RouteOnEmpty: FC = () => {
  const { recipe } = useRecipe();
  const history = useHistory();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  useEffect(
    () => {
      setTimeout(setHasLoaded, 500, true);
    },
    [setHasLoaded],
  );
  useEffect(
    () => {
      if (hasLoaded && !recipe) {
        history.push('/not-found');
      }
    },
    [recipe, hasLoaded, history],
  );
  return <></>;
};

export const RecipeScreen: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const path = useRouteMatch({
    path: baseRoute,
  });
  const { name } = useParams<{name:string}>();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<number>(
    path
      ? (
        () => {
          const idx = tabs.findIndex(
            ({ route }) => route === location.pathname.replace(path.url, ''),
          );
          if (idx >= 0) {
            return idx;
          }
          return 0;
        }
      )()
      : 0,
  );
  useEffect(
    () => {
      if (path && path.isExact) {
        history.replace(`${path.url}${tabs[0].route}`);
        setTab(0);
      }
    },
    [path, history, location],
  );
  const prevTab = usePrevious(tab);
  useEffect(
    () => {
      if (path && prevTab !== tab) {
        history.replace(`${path.url}${(tabs[tab] || tabs[0]).route}`);
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
      <RouteOnEmpty />
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
