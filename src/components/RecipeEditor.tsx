import React, {
  FC,
  ChangeEvent,
  useCallback,
} from 'react';
import {
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
import { onMobile, StyledCard, StyledExpandCardContent } from './styled';
import { ConfirmDialog, useConfirm } from './Confirm';
import { SymbolsEditor } from './SymbolsEditor';

export const StyledContainer = styled(Container)`
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0 !important;
  ${onMobile} {
    grid-template-columns: 1fr;
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

export const RecipeEditor: FC = () => {
  const { removeRecipe } = useRecipes();
  const history = useHistory();
  const {
    name,
    recipe,
  } = useRecipe();
  const removeHandler = useCallback(
    () => {
      removeRecipe(name);
      history.push('/');
    },
    [removeRecipe, name, history],
  );
  const { ...confirmArgs } = useConfirm(removeHandler);
  if (!recipe) {
    return null;
  }
  return (
    <>
      <Title title={`Edit: ${camelCaseToCapitalized(name)}`} />
      <StyledContainer>
        <div>
          <SymbolsEditor />
        </div>
        <div>
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
        </div>
      </StyledContainer>
      <ConfirmDialog {...confirmArgs}>
        Are you sure you want to delete this recipe (
        {name}
        )?
      </ConfirmDialog>
    </>
  );
};
