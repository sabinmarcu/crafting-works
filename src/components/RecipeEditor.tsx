import React, {
  FC,
  ChangeEvent,
  useCallback,
} from 'react';
import {
  Button,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import {
  useRecipe,
  useInput,
  useOutput,
  useRecipes,
} from '../state/recipes-v3';

import { Title } from '../state/title';
import { camelCaseToCapitalized } from '../utils/strings';
import {
  onMobile, RightCardActions, StyledCard, StyledExpandCardContent,
} from './styled';
import { ConfirmDialog, useConfirm } from './Confirm';
import { SymbolsEditor } from './SymbolsEditor';

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

export const StyledTextField = styled(TextField)`
  margin: 0.5rem 0 !important;
`;

export const Input: FC<{
  name: string
}> = ({
  name,
}) => {
  const [value, setValue] = useInput(name);
  const onChange = useCallback(
    ({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => setValue(v),
    [setValue],
  );
  return (
    <StyledTextField
      fullWidth
      label={camelCaseToCapitalized(name)}
      value={value}
      type="number"
      onChange={onChange}
    />
  );
};

export const Output: FC = () => {
  const [value, setValue] = useOutput();
  const onChange = useCallback(
    ({ target: { value: v } }: ChangeEvent<HTMLInputElement>) => setValue(v),
    [setValue],
  );
  return (
    <StyledTextField
      fullWidth
      label="Output Number"
      value={value}
      type="number"
      onChange={onChange}
    />
  );
};

export const RemoveRecipe: FC = () => {
  const {
    name,
  } = useRecipe();
  const { removeRecipe } = useRecipes();
  const history = useHistory();
  const removeHandler = useCallback(
    () => {
      removeRecipe(name);
      history.push('/');
    },
    [removeRecipe, name, history],
  );
  const { onOpen, ...confirmArgs } = useConfirm(removeHandler);
  return (
    <>
      <StyledCard>
        <RightCardActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={onOpen}
          >
            Delete Recipe
          </Button>
        </RightCardActions>
      </StyledCard>
      <ConfirmDialog {...confirmArgs}>
        Are you sure you want to delete this recipe (
        {camelCaseToCapitalized(name)}
        )?
      </ConfirmDialog>
    </>
  );
};

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
          <StyledCard>
            <CardHeader title="Materials" />
            <StyledExpandCardContent>
              {Object.keys(recipe.input).sort().map((it) => (
                <Input
                  name={it}
                  key={it}
                />
              ))}
            </StyledExpandCardContent>
            <CardContent>
              <Output />
            </CardContent>
          </StyledCard>
        </InputsWrapper>
        <RemoveWrapper>
          <RemoveRecipe />
        </RemoveWrapper>
      </StyledContainer>
    </>
  );
};
