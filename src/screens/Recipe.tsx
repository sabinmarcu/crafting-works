import React, {
  FC, useMemo,
  // ChangeEvent, useCallback, useEffect, useState,
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from '@material-ui/core';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { useItem, useList } from '../state/recipes-v2';
import { Title } from '../state/title';
import { camelCaseToCapitalized } from '../utils/strings';
import { SymbolsList } from '../components/SymbolsList';

export const StyledContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledTextField = styled(TextField)`
  margin: 0.5rem 0;
`;

// type ComboBoxAddType = {inputValue?: string};

export const RecipeScreen: FC<RouteComponentProps<{ name: string }>> = ({
  match: {
    params: { name },
  },
}) => {
  const allSymbols = useList();
  const [{
    value: item,
    key,
  }] = useItem(name);
  const symbols = useMemo(
    () => (item ? Object.keys(item.input) : [])
      .map((it) => ({ name: it, composite: allSymbols.includes(it) })),
    [item],
  );
  console.log(item);
  return (
    <>
      <Title title={`Recipe: ${camelCaseToCapitalized(key)}`} />
      <StyledContainer>
        <Card>
          <CardHeader title="Symbols Used" />
          <CardContent>
            <SymbolsList symbols={symbols} />
          </CardContent>
        </Card>
      </StyledContainer>
    </>
  );
};

export default RecipeScreen;
