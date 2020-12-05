import React, { FC, useMemo } from 'react';
import {
  Card, CardContent, CardHeader, Container, Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import { useResources } from '../state/recipes-v3';
import { onMobile } from './styled';
import { camelCaseToCapitalized } from '../utils/strings';

export const StyledContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
  ${onMobile} {
    grid-template-columns: 1fr;
  }
`;

export const ResourceWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const ResourceText = styled(Typography)`
  flex: 1;
`;

export const ResourceNumber = styled(Typography)`

`;

export const ResourcePreview: FC<{
  text: string,
  amount: number
}> = ({
  text,
  amount,
}) => (
  <ResourceWrapper>
    <ResourceText>{camelCaseToCapitalized(text)}</ResourceText>
    <ResourceNumber>{amount}</ResourceNumber>
  </ResourceWrapper>
);

export const ResourcesView: FC = () => {
  const resources = useResources();
  const rootResources = useMemo(
    () => Object.entries(resources)
      .filter(([key]) => !key.startsWith('_')),
    [resources],
  );
  return (
    <StyledContainer>
      <Card>
        <CardHeader title="Total Resouces" />
        <CardContent>
          {rootResources.map(
            ([key, value]) => (
              <ResourcePreview key={key} text={key} amount={value} />
            ),
          )}
        </CardContent>
      </Card>
    </StyledContainer>
  );
};

export const RecipeViewer: FC = () => (
  <ResourcesView />
);

export default RecipeViewer;
