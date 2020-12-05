import React, {
  FC, useCallback, useState,
} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  AppBar, Container, Tab, Tabs,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  RecipeProvider,
} from '../state/recipes-v3';

import { useIsMobile } from '../hooks/useIsMobile';
import { RecipeEditor } from '../components/RecipeEditor';
import { RecipeViewer } from '../components/RecipeViewer';

const StyledContainer = styled(Container)`
  padding: 1rem 0;
`;

export const TabPanel: FC<{ isOpen: boolean }> = ({ children, isOpen }) => (
  <div
    hidden={!isOpen}
  >
    {isOpen && children}
  </div>
);

const tabs = [
  { title: 'Editor', Component: RecipeEditor },
  { title: 'Viewer', Component: RecipeViewer },
];

export const RecipeScreen: FC<RouteComponentProps<{ name: string }>> = ({
  match: {
    params: { name },
  },
}) => {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<number>(0);
  const onChange = useCallback(
    (event, newValue) => setTab(newValue),
    [setTab],
  );
  return (
    <RecipeProvider name={name}>
      <StyledContainer>
        <AppBar position="static">
          <Tabs
            value={tab}
            onChange={onChange}
            variant={isMobile ? 'fullWidth' : undefined}
          >
            {tabs.map(({ title }) => <Tab label={title} key={title} />)}
          </Tabs>
        </AppBar>
        {tabs.map(({ title, Component }, idx) => (
          <TabPanel
            isOpen={tab === idx}
            key={title}
          >
            <Component />
          </TabPanel>
        ))}
      </StyledContainer>
    </RecipeProvider>
  );
};

export default RecipeScreen;
