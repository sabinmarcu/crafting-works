import React, {
  FC,
} from 'react';
import {
  Container,
} from '@material-ui/core';
import styled from 'styled-components';
import {
  useRecipe,
} from '../../state/recipes-v3';

import { Title } from '../../state/title';
import { camelCaseToCapitalized } from '../../utils/strings';
import {
  onMobile,
} from '../styled';
import { SymbolsEditor } from './SymbolsEditor';
import { RemoveRecipe } from './RemoveRecipe';
import { MaterialsEditor } from './MaterialsEditor';

export const StyledContainer = styled(Container)`
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0 !important;
  & > * {
    grid-column: 1;
  }
  ${onMobile} {
    grid-template-columns: 1fr;
    & > * {
      grid-column: 1 !important;
    }
  }
`;

export const SymbolsWrapper = styled.div`
  grid-row: 1;
  ${onMobile} {
    grid-row: 1;
  }
`;

export const RemoveWrapper = styled.div`
  grid-row: 2;
  ${onMobile} {
    grid-row: 3;
  }
`;

export const InputsWrapper = styled.div`
  grid-row: 1/5;
  grid-column: 2;
  ${onMobile} {
    grid-row: 2;
  }
`;

export const RecipeEditor: FC = () => {
  const {
    name,
    recipe,
  } = useRecipe();
  if (!recipe) {
    return null;
  }
  return (
    <>
      <Title title={`Edit: ${camelCaseToCapitalized(name)}`} />
      <StyledContainer>
        <SymbolsWrapper>
          <SymbolsEditor />
        </SymbolsWrapper>
        <InputsWrapper>
          <MaterialsEditor />
        </InputsWrapper>
        <RemoveWrapper>
          <RemoveRecipe />
        </RemoveWrapper>
      </StyledContainer>
    </>
  );
};
