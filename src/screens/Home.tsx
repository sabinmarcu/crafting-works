import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Container,
} from '@material-ui/core';
import styled from 'styled-components';

import { Title } from '../state/title';
import Symbols from '../components/SymbolsList';
import { RecipesList } from '../components/RecipesList';

export const StyledContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const HomeScreen = () => (
  <>
    <Title title="Home" isRoot />
    <StyledContainer>
      <Card>
        <CardHeader title="Symbols" />
        <CardContent>
          <Symbols />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Recipes" />
        <CardContent>
          <RecipesList />
        </CardContent>
      </Card>
    </StyledContainer>
  </>
);
export default HomeScreen;
